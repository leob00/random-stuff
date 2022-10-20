import { TextField } from '@aws-amplify/ui-react'
import { Delete } from '@mui/icons-material'
import { Box, Button, Divider, Stack } from '@mui/material'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, findIndex, findLast, orderBy } from 'lodash'
import React from 'react'
import EditNote from './EditNote'

export interface UserNotesModel {
  noteTitles: UserNote[]
  selectedNote: UserNote | null
  username: string
  isLoading: boolean
  editMode: boolean
  userProfile: UserProfile
}
type ActionTypes =
  | { type: 'reload'; payload: { noteTitles: UserNote[] } }
  | { type: 'edit-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'cancel-edit' }
  | { type: 'set-loading'; payload: { isLoading: boolean } }
  | { type: 'save-note'; payload: { noteList: UserNote[] } }

function reducer(state: UserNotesModel, action: ActionTypes) {
  switch (action.type) {
    case 'reload':
      return { ...state, editMode: false, noteTitles: orderBy(action.payload.noteTitles, ['dateModified'], ['desc']), isLoading: false }
    case 'edit-note':
      return { ...state, editMode: true, selectedNote: action.payload.selectedNote }
    case 'save-note':
      return { ...state, editMode: false, noteTitles: action.payload.noteList, isLoading: false }
    case 'cancel-edit':
      return { ...state, editMode: false }
    case 'set-loading':
      return { ...state, isLoading: action.payload.isLoading }

    default: {
      throw 'invalid type'
    }
  }
}

const UserNotesLayout = ({ data }: { data: UserNotesModel }) => {
  const [model, dispatch] = React.useReducer(reducer, data)

  const handleAddNote = () => {
    dispatch({
      type: 'edit-note',
      payload: {
        selectedNote: {
          title: '',
          body: '',
          dateCreated: '',
          dateModified: '',
        },
      },
    })
    //router.push(`/protected/csr/note`)
  }

  const handleSaveNote = async (item: UserNote) => {
    //console.log(item)
    let notes = cloneDeep(model.noteTitles)
    if (!item.id) {
      item.id = constructUserNotePrimaryKey(model.username)
      notes.push({
        id: item.id,
        title: item.title,
        body: item.body,
        dateCreated: getUtcNow().format(),
        dateModified: getUtcNow().format(),
      })
    } else {
      const existingIx = findIndex(notes, (e) => {
        return e.id === item.id
      })
      if (existingIx) {
        notes.splice(existingIx, 1)
        item.dateModified = getUtcNow().format()
        notes.push(item)
      }
    }
    notes = orderBy(notes, ['dateModified'], ['desc'])
    model.userProfile.noteTitles = notes
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    await putUserProfile(model.userProfile)
    dispatch({ type: 'save-note', payload: { noteList: notes } })

    //dispatch({ type: 'cancel-edit' })
  }
  const handleCancelClick = async () => {
    dispatch({ type: 'cancel-edit' })
  }
  const handleNoteTitleClick = (item: UserNote) => {
    console.log(item)
    dispatch({ type: 'edit-note', payload: { selectedNote: item } })
  }

  return (
    <>
      <CenterStack>
        <CenteredTitle title={'My Notes'}></CenteredTitle>
      </CenterStack>
      <Box display='flex' flexDirection='row' sx={{ py: 2 }}>
        <Stack flexDirection='row' gap={4}>
          <Button color='secondary' size='small' variant='contained' onClick={handleAddNote} disabled={model.isLoading || model.editMode}>
            {'add note'}
          </Button>
          <TextField size='small' label={''} placeholder='search notes' disabled={model.isLoading || model.editMode}></TextField>
        </Stack>
      </Box>

      <Divider />
      {model.isLoading ? (
        <WarmupBox />
      ) : !model.editMode ? (
        <CenterStack sx={{ py: 2 }}>
          <Box sx={{ width: '80%' }}>
            {model.noteTitles.map((item, i) => (
              <Box key={i}>
                <Stack direction='row' flexGrow={1} gap={2} py={3} pl={2}>
                  <LinkButton
                    onClick={() => {
                      handleNoteTitleClick(item)
                    }}
                  >
                    {item.title}
                  </LinkButton>
                  <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end'>
                    <Button size='small'>
                      <Delete color='error' />
                    </Button>
                  </Stack>
                </Stack>

                <Divider />
              </Box>
            ))}
          </Box>
        </CenterStack>
      ) : (
        model.selectedNote && <EditNote item={model.selectedNote} onCanceled={handleCancelClick} onSubmitted={handleSaveNote} />
      )}
    </>
  )
}

export default UserNotesLayout

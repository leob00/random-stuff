import { TextField } from '@aws-amplify/ui-react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { UserNote } from 'lib/models/randomStuffModels'
import router from 'next/router'
import React from 'react'

export interface UserNotesModel {
  noteTitles: UserNote[]
  selectedNote: UserNote | null
  username: string
  isLoading: boolean
  editMode: boolean
}
type ActionTypes =
  | { type: 'reload'; payload: { noteTitles: UserNote[] } }
  | { type: 'edit-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'cancel-edit' }

function reducer(state: UserNotesModel, action: ActionTypes) {
  switch (action.type) {
    case 'reload':
      return { ...state, noteTitles: action.payload.noteTitles, isLoading: false, editMode: false }
    case 'edit-note':
      return { ...state, editMode: true, selectedNote: action.payload.selectedNote }
    case 'cancel-edit':
      return { ...state, editMode: false }

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
        <LargeSpinner />
      ) : !model.editMode ? (
        <CenterStack sx={{ py: 2 }}>
          {model.noteTitles.map((item) => (
            <Box key={item.id}>
              <InternalLinkButton text={item.title} route='/' />
            </Box>
          ))}
        </CenterStack>
      ) : (
        <Box sx={{ py: 2 }}>
          <CenterStack>
            <TextField size='small' label={''} placeholder='title' width={'50%'}></TextField>
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <Button
              sx={{ backgroundColor: CasinoGrayTransparent }}
              variant='outlined'
              onClick={() => {
                dispatch({ type: 'cancel-edit' })
              }}
            >
              cancel
            </Button>
          </CenterStack>
        </Box>
      )}
    </>
  )
}

export default UserNotesLayout

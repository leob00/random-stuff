import { Box, Button, Divider, Stack } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { deleteUserNote, getUserNote, putUserNote, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, findIndex, orderBy } from 'lodash'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'
import router from 'next/router'
import { ArrowBack, Cancel, Close, CloseOutlined, Create, Edit, EditSharp, Save, SaveSharp } from '@mui/icons-material'
const UserNotesLayout = ({ data }: { data: UserNotesModel }) => {
  const [model, dispatch] = React.useReducer(notesReducer, data)

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
  }
  const handleEditNote = async (item: UserNote) => {
    dispatch({
      type: 'edit-note',
      payload: {
        selectedNote: item,
      },
    })
  }

  const handleSaveNote = async (item: UserNote) => {
    let notes = cloneDeep(model.noteTitles)
    if (!item.id) {
      item.id = constructUserNotePrimaryKey(model.username)
      notes.push({
        id: item.id,
        title: item.title,
        body: '',
        dateCreated: getUtcNow().format(),
        dateModified: getUtcNow().format(),
      })
    } else {
      const existingIx = findIndex(notes, (e) => {
        return e.id === item.id
      })
      if (existingIx > -1) {
        notes.splice(existingIx, 1)
        notes.push({
          id: item.id,
          title: item.title,
          body: '',
          dateCreated: item.dateCreated,
          dateModified: getUtcNow().format(),
        })
      }
    }
    item.dateModified = getUtcNow().format()
    notes = orderBy(notes, ['dateModified'], ['desc'])
    model.userProfile.noteTitles = notes
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    await putUserProfile(model.userProfile)
    await putUserNote(item, constructUserNoteCategoryKey(model.username))
    dispatch({ type: 'save-note', payload: { noteTitles: notes } })
  }
  const handleCancelClick = async () => {
    if (model.selectedNote && model.selectedNote.id && !model.viewMode) {
      dispatch({ type: 'view-note', payload: { selectedNote: model.selectedNote } })
    } else {
      dispatch({ type: 'cancel-edit' })
    }
  }
  const handleNoteTitleClick = async (item: UserNote) => {
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    const note = await getUserNote(item.id)
    dispatch({ type: 'view-note', payload: { selectedNote: note } })
  }

  const handleDelete = async (item: UserNote) => {
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    let noteTitles = filter(model.noteTitles, (e) => {
      return e.id !== item.id
    })
    let profile = model.userProfile
    profile.noteTitles = noteTitles
    await deleteUserNote(item)
    await putUserProfile(profile)
    dispatch({ type: 'reload', payload: { noteTitles: noteTitles } })
  }

  const handleSearch = async (text: string) => {
    dispatch({ type: 'search', payload: { search: text } })
  }

  return (
    <>
      {!model.editMode && !model.viewMode && (
        <>
          <BackButton
            onClicked={() => {
              router.push('/protected/csr')
            }}
          />
          <Box sx={{ py: 2 }}>
            <CenterStack>
              <SearchWithinList onChanged={handleSearch} disabled={model.isLoading || model.editMode} text='search notes' defaultValue={model.search} />
            </CenterStack>
          </Box>
        </>
      )}
      <Divider />
      {!model.editMode && !model.viewMode && (
        <CenterStack sx={{ py: 2 }}>
          <SecondaryButton text='add note' onClick={handleAddNote} disabled={model.isLoading || model.editMode} />
        </CenterStack>
      )}
      {model.isLoading ? (
        <WarmupBox />
      ) : !model.editMode ? (
        model.selectedNote === null ? (
          <NoteList data={model.filteredTitles} onClicked={handleNoteTitleClick} onDelete={handleDelete} />
        ) : (
          model.viewMode &&
          model.selectedNote !== null && (
            <>
              <Stack display='flex' flexDirection='row' gap={1} justifyContent='flex-end'>
                <Stack>
                  <Button
                    onClick={() => {
                      handleEditNote(model.selectedNote!)
                    }}
                  >
                    <Create />
                  </Button>
                </Stack>
                <Stack>
                  <Button onClick={handleCancelClick}>
                    <Cancel />
                  </Button>
                </Stack>
              </Stack>
              <ViewNote selectedNote={model.selectedNote} onEdit={handleEditNote} onCancel={handleCancelClick} />
            </>
          )
        )
      ) : (
        model.selectedNote && (
          <>
            <EditNote item={model.selectedNote} onCanceled={handleCancelClick} onSubmitted={handleSaveNote} />
          </>
        )
      )}
    </>
  )
}

export default UserNotesLayout

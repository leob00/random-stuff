import { Box, Divider } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { constructUserNoteCategoryKey } from 'lib/backend/api/aws/util'
import { expireUserNote, getUserNote, putUserNote, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { filter } from 'lodash'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'
import router from 'next/router'
import ButtonSkeleton from 'components/Atoms/Skeletons/CenteredButtonSeleton'
import { buildSaveModel } from 'lib/controllers/notes/notesController'
import { useUserController } from 'hooks/userController'
const UserNotesLayout = ({ data }: { data: UserNotesModel }) => {
  const [model, dispatch] = React.useReducer(notesReducer, data)
  const userController = useUserController()

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
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    const saveModel = await buildSaveModel(model, item)
    userController.setProfile(saveModel.userProfile)
    await putUserProfile(saveModel.userProfile)
    await putUserNote(item, constructUserNoteCategoryKey(saveModel.username))
    dispatch({ type: 'save-note', payload: { noteTitles: saveModel.noteTitles } })
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
    let profile = model.userProfile
    let noteTitles = filter(profile.noteTitles, (e) => {
      return e.id !== item.id
    })
    profile.noteTitles = noteTitles
    userController.setProfile(profile)
    await expireUserNote(item)
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
              router.push('/protected/csr/dashboard')
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
          {model.isLoading || model.editMode ? <ButtonSkeleton buttonText='add note' /> : <SecondaryButton text='add note' onClick={handleAddNote} />}
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

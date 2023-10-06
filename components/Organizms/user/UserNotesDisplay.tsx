import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import WarmupBox from 'components/Atoms/WarmupBox'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { constructUserNoteCategoryKey } from 'lib/backend/api/aws/util'
import { postDelete } from 'lib/backend/api/fetchFunctions'
import { expireUserNote, getUserNote, putUserNote, putUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { buildSaveModel } from 'lib/controllers/notes/notesController'
import { UserNote } from 'lib/models/randomStuffModels'
import { filter } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'

const UserNotesDisplay = ({ result, username, onMutated }: { result: UserNote[]; username: string; onMutated: (newData: UserNote[]) => void }) => {
  const defaultModel: UserNotesModel = {
    noteTitles: result,
    isLoading: false,
    username: username,
    editMode: false,
    selectedNote: null,
    viewMode: false,
    filteredTitles: result,
    search: '',
  }
  const [model, dispatch] = React.useReducer(notesReducer, defaultModel)

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
    await putUserNoteTitles(username, saveModel.noteTitles)

    if (item.expirationDate) {
      const expireSeconds = Math.floor(dayjs(item.expirationDate).valueOf() / 1000)
      await putUserNote(item, constructUserNoteCategoryKey(saveModel.username), expireSeconds)
    } else {
      await putUserNote(item, constructUserNoteCategoryKey(saveModel.username))
    }
    dispatch({ type: 'save-note', payload: { noteTitles: saveModel.noteTitles, selectedNote: item } })
    onMutated(saveModel.noteTitles)
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
    const note = await getUserNote(item.id!)
    dispatch({ type: 'view-note', payload: { selectedNote: note } })
  }

  const handleDelete = async (item: UserNote) => {
    dispatch({ type: 'set-loading', payload: { isLoading: true } })
    let noteTitles = filter(model.noteTitles, (e) => {
      return e.id !== item.id
    })

    await expireUserNote(item)
    await putUserNoteTitles(model.username, noteTitles)
    const files = item.attachments ?? []
    if (files.length > 0) {
      files.map(async (file) => {
        await postDelete('/api/s3', file)
      })
    }

    dispatch({ type: 'reload', payload: { noteTitles: noteTitles } })
    onMutated(noteTitles)
  }

  const handleNoteSelected = (text: string) => {
    const note = result.find((m) => m.title === text)
    if (note) {
      handleNoteTitleClick(note)
    }
  }

  return (
    <>
      {!model.editMode && !model.viewMode && (
        <>
          <Box py={2}>
            <CenterStack>
              <StaticAutoComplete options={result.map((m) => m.title)} placeholder={`search ${result.length} notes`} onSelected={handleNoteSelected} />
            </CenterStack>
          </Box>
        </>
      )}
      {model.isLoading ? (
        <WarmupBox />
      ) : !model.editMode ? (
        model.selectedNote === null ? (
          <>
            <NoteList
              data={result}
              onClicked={handleNoteTitleClick}
              onDelete={handleDelete}
              onAddNote={handleAddNote}
              isFiltered={model.filteredTitles.length < model.noteTitles.length}
            />
          </>
        ) : (
          model.viewMode &&
          model.selectedNote !== null && (
            <>
              <ViewNote selectedNote={model.selectedNote} onEdit={handleEditNote} onCancel={handleCancelClick} onDelete={handleDelete} />
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
export default UserNotesDisplay

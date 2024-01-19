import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import dayjs from 'dayjs'
import { S3Object, UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNoteCategoryKey } from 'lib/backend/api/aws/util'
import { postDelete } from 'lib/backend/api/fetchFunctions'
import { expireUserNote, getUserNote, putUserNote, putUserNoteTitles } from 'lib/backend/csr/nextApiWrapper'
import { buildSaveModel } from 'lib/controllers/notes/notesController'
import { filter } from 'lodash'
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

  const handleFilesMutated = async (files: S3Object[]) => {
    const n = { ...model.selectedNote! }
    n.attachments = files
    await handleSaveNote(n)
  }

  return (
    <>
      {model.isLoading && <BackdropLoader />}
      <>
        {!model.editMode && !model.selectedNote && (
          <>
            <PageHeader text={'Notes'} />
            <NoteList data={result} onClicked={handleNoteTitleClick} onDelete={handleDelete} onAddNote={handleAddNote} />
          </>
        )}
        {model.selectedNote && !model.editMode && (
          <>
            <ViewNote
              selectedNote={model.selectedNote}
              onEdit={handleEditNote}
              onCancel={handleCancelClick}
              onDelete={handleDelete}
              onFilesMutated={handleFilesMutated}
            />
          </>
        )}
        {model.editMode && !model.viewMode && model.selectedNote && (
          <EditNote item={model.selectedNote} onCanceled={handleCancelClick} onSubmitted={handleSaveNote} />
        )}
      </>
    </>
  )
}
export default UserNotesDisplay

import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { notesReducer, UserNotesModel } from 'components/reducers/notesReducer'
import { constructUserNoteCategoryKey, constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { expireUserNote, getUserNote, getUserNoteTitles, putUserNote, putUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { filter } from 'lodash'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'
import { buildSaveModel } from 'lib/controllers/notes/notesController'
import { useUserController } from 'hooks/userController'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import useSWR from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const UserNotesLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const enc = encodeURIComponent(weakEncrypt(constructUserNoteTitlesKey(userProfile.username)))
  const fetchData = async (url: string, enc: string) => {
    const result = await getUserNoteTitles(userProfile.username)
    return result
  }

  const { data: notes, isLoading, isValidating } = useSWR(['/api/edgeGetRandomStuff', enc], ([url, enc]) => fetchData(url, enc))

  const RenderDisplay = ({ result }: { result: UserNote[] }) => {
    const defaultModel: UserNotesModel = {
      noteTitles: result,
      isLoading: false,
      username: '',
      editMode: false,
      selectedNote: null,
      userProfile: { id: '', username: '' },
      viewMode: false,
      filteredTitles: result,
      search: '',
    }
    const [model, dispatch] = React.useReducer(notesReducer, defaultModel)
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
      if (item.expirationDate) {
        const expireSeconds = Math.floor(dayjs(item.expirationDate).valueOf() / 1000)
        await putUserNote(item, constructUserNoteCategoryKey(saveModel.username), expireSeconds)
      } else {
        await putUserNote(item, constructUserNoteCategoryKey(saveModel.username))
      }
      dispatch({ type: 'save-note', payload: { noteTitles: saveModel.noteTitles, selectedNote: item } })
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
    const handleSearch = async (text: string) => {
      dispatch({ type: 'search', payload: { search: text } })
    }
    const handleDelete = async (item: UserNote) => {
      dispatch({ type: 'set-loading', payload: { isLoading: true } })
      let noteTitles = filter(model.noteTitles, (e) => {
        return e.id !== item.id
      })

      await expireUserNote(item)
      await putUserNoteTitles(model.userProfile.username, noteTitles)
      dispatch({ type: 'reload', payload: { noteTitles: noteTitles } })
    }
    return (
      <>
        {!model.editMode && !model.viewMode && (
          <>
            <Box sx={{ py: 2 }}>
              <CenterStack>
                <SearchWithinList width={350} onChanged={handleSearch} disabled={model.isLoading || model.editMode} text={`search ${numeral(model.noteTitles.length).format('###,###')} notes`} defaultValue={model.search} />
              </CenterStack>
            </Box>
          </>
        )}
        {model.isLoading ? (
          <WarmupBox />
        ) : !model.editMode ? (
          model.selectedNote === null ? (
            <>
              <NoteList data={model.filteredTitles} onClicked={handleNoteTitleClick} onDelete={handleDelete} onAddNote={handleAddNote} isFiltered={model.filteredTitles.length < model.noteTitles.length} />
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
  return (
    <>
      {isLoading && <BackdropLoader />}
      {notes && <RenderDisplay result={notes} />}
    </>
  )
}

export default UserNotesLayout

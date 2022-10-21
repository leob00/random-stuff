import { TextField } from '@aws-amplify/ui-react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoBlueTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { deleteUserNote, getUserNote, putUserNote, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, findIndex, orderBy } from 'lodash'
import React from 'react'
import EditNote from './EditNote'
import NoteList from './NoteList'
import ViewNote from './ViewNote'

export interface UserNotesModel {
  noteTitles: UserNote[]
  selectedNote: UserNote | null
  username: string
  isLoading: boolean
  editMode: boolean
  viewMode: boolean
  userProfile: UserProfile
  filteredTitles: UserNote[]
  search: string
}
type ActionTypes =
  | { type: 'reload'; payload: { noteTitles: UserNote[] } }
  | { type: 'edit-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'view-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'cancel-edit' }
  | { type: 'set-loading'; payload: { isLoading: boolean } }
  | { type: 'save-note'; payload: { noteTitles: UserNote[] } }
  | { type: 'search'; payload: { search: string } }

function applyFilter(list: UserNote[], search: string) {
  return filter(list, (e) => {
    return e.title.toLocaleLowerCase().includes(search.toLowerCase())
  })
}

function reducer(state: UserNotesModel, action: ActionTypes) {
  switch (action.type) {
    case 'reload':
      return {
        ...state,
        editMode: false,
        noteTitles: orderBy(action.payload.noteTitles, ['dateModified'], ['desc']),
        isLoading: false,
        viewMode: false,
        filteredTitles: orderBy(action.payload.noteTitles, ['dateModified'], ['desc']),
        search: '',
      }
    case 'edit-note':
      return { ...state, editMode: true, selectedNote: action.payload.selectedNote, viewMode: false, isLoading: false }
    case 'view-note':
      return { ...state, editMode: false, selectedNote: action.payload.selectedNote, viewMode: true, isLoading: false }
    case 'save-note':
      return {
        ...state,
        editMode: false,
        noteTitles: action.payload.noteTitles,
        isLoading: false,
        viewMode: true,
        search: '',
        filteredTitles: action.payload.noteTitles,
      }
    case 'cancel-edit':
      return { ...state, editMode: false, selectedNote: null, viewMode: false }
    case 'set-loading':
      return { ...state, isLoading: action.payload.isLoading }
    case 'search':
      return { ...state, filteredTitles: applyFilter(state.noteTitles, action.payload.search) }
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
    //console.log('date mod: ', item.dateModified)
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
      <CenterStack>
        <CenteredTitle title={'My Notes'}></CenteredTitle>
      </CenterStack>
      {!model.editMode && !model.viewMode && (
        <Box sx={{ py: 2 }}>
          <CenterStack>
            <SearchWithinList onChanged={handleSearch} disabled={model.isLoading || model.editMode} text='search notes' defaultValue={model.search} />
          </CenterStack>
        </Box>
      )}
      <Divider />
      {!model.editMode && !model.viewMode && (
        <CenterStack sx={{ py: 2 }}>
          <SecondaryButton text='add note' onClick={handleAddNote} disabled={model.isLoading || model.editMode} />
        </CenterStack>
      )}
      {model.isLoading ? (
        <WarmupBox text={'loading...'} />
      ) : !model.editMode ? (
        model.selectedNote === null ? (
          <NoteList data={model.filteredTitles} onClicked={handleNoteTitleClick} onDelete={handleDelete} />
        ) : (
          model.viewMode && model.selectedNote && <ViewNote selectedNote={model.selectedNote} onEdit={handleEditNote} onCancel={handleCancelClick} />
        )
      ) : (
        model.selectedNote && <EditNote item={model.selectedNote} onCanceled={handleCancelClick} onSubmitted={handleSaveNote} />
      )}
    </>
  )
}

export default UserNotesLayout

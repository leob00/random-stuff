import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { UserNote } from 'lib/models/randomStuffModels'
import { filter, orderBy } from 'lodash'

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
export type ActionTypes =
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

export function notesReducer(state: UserNotesModel, action: ActionTypes) {
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
      return { ...state, editMode: false, selectedNote: null, viewMode: false, filteredTitles: applyFilter(state.noteTitles, state.search) }
    case 'set-loading':
      return { ...state, isLoading: action.payload.isLoading }
    case 'search':
      return { ...state, filteredTitles: applyFilter(state.noteTitles, action.payload.search) }
    default: {
      throw 'invalid type'
    }
  }
}

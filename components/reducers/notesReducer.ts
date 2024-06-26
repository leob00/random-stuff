import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { filter, orderBy } from 'lodash'

export interface UserNotesModel {
  noteTitles: UserNote[]
  username: string
  isLoading: boolean
  filteredTitles: UserNote[]
  search: string
}
export type ActionTypes =
  | { type: 'reload'; payload: { noteTitles: UserNote[] } }
  | { type: 'edit-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'view-note'; payload: { selectedNote: UserNote | null } }
  | { type: 'cancel-edit' }
  | { type: 'set-loading'; payload: { isLoading: boolean } }
  | { type: 'save-note'; payload: { noteTitles: UserNote[]; selectedNote: UserNote } }
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
        selectedNote: null,
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
        selectedNote: action.payload.selectedNote,
      }
    case 'cancel-edit':
      return { ...state, editMode: false, selectedNote: null, viewMode: false, filteredTitles: applyFilter(state.noteTitles, state.search) }
    case 'set-loading':
      return { ...state, isLoading: action.payload.isLoading }
    case 'search':
      return { ...state, search: action.payload.search, filteredTitles: applyFilter(state.noteTitles, action.payload.search) }
    default: {
      throw 'invalid type'
    }
  }
}

import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem } from 'lib/models/dropdown'

export interface S3ModelState {
  uiState: S3DisplayState
}

type S3DisplayState = {
  selectedItems: S3Object[]
  selectedItem: S3Object | null
  itemToDelete: S3Object | null
  targetFolder: DropdownItem | null
  signedUrl: string | null
  isEditEmode: boolean
  showMoveFilesDialog: boolean
  showRenameFileDialog: boolean
  showDeleteFilesDialog: boolean
  showListIterator: boolean
}
export type ActionTypes = { type: 'reset'; payload: S3DisplayState } | { type: 'update'; payload: S3DisplayState }
// | { type: 'updateTargetFolder'; payload: DropdownItem | null }
// | { type: 'updateSelectedItems'; payload: S3Object[] }
// | { type: 'updateSelectedItem'; payload: S3Object | null }
// | { type: 'updateViewFile'; payload: { viewFile: S3Object | null; signedUrl: string | null } }

export function useS3DisplayState(state: S3ModelState, action: ActionTypes): S3ModelState {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        uiState: action.payload,
      }
    case 'reset':
      return {
        ...state,
        uiState: action.payload,
      }

    default: {
      throw 'invalid type'
    }
  }
}

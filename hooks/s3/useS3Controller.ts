import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import { S3ModelState, useS3DisplayState } from './useS3DisplayState'

export const useS3Controller = () => {
  const { setProfile } = useUserController()
  const defaultState: S3ModelState = {
    uiState: {
      selectedItems: [],
      targetFolder: null,
      selectedItem: null,
      signedUrl: null,
      isEditEmode: false,
      itemToDelete: null,
      showMoveFilesDialog: false,
      showRenameFileDialog: false,
      showDeleteFilesDialog: false,
      showListIterator: false,
      snackbarSuccessMessage: null,
    },
  }
  //const s3DisplayState = useS3DisplayState()
  const [state, dispatch] = React.useReducer(useS3DisplayState, defaultState)

  const addFolder = async (userProfile: UserProfile, name: string, allFolders: DropdownItem[]) => {
    const newFolders = [...allFolders]
    const newItem: DropdownItem = {
      text: name,
      value: `${userProfile.username}/${name}`,
    }
    newFolders.push(newItem)
    const newProfile = { ...userProfile }
    const sorted = sortArray(newFolders, ['text'], ['asc'])
    newProfile.settings!.folders = sorted
    newProfile.settings!.selectedFolder = newItem
    await setProfile(newProfile)
    await putUserProfile(newProfile)
    return sorted
  }

  const deleteFolder = async (userProfile: UserProfile, name: string, allFolders: DropdownItem[]) => {
    const newFolders = [...allFolders].filter((m) => m.text !== name)
    const newProfile = { ...userProfile }
    const sorted = sortArray(newFolders, ['text'], ['asc'])
    newProfile.settings!.folders = sorted
    newProfile.settings!.selectedFolder = sorted[0]
    await putUserProfile(newProfile)
    await setProfile(newProfile)
    return sorted
  }

  return {
    uiState: state.uiState,
    uiDefaultState: defaultState.uiState,
    dispatch,
    addFolder,
    deleteFolder,
  }
}
export type S3Controller = ReturnType<typeof useS3Controller>

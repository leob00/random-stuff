import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { postDelete } from 'lib/backend/api/fetchFunctions'
import { getPresignedUrl, renameS3File } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { S3Controller } from 'hooks/s3/useS3Controller'
import { sleep } from 'lib/util/timers'
import S3FileRow from './S3FileRow'
import S3FilesTableHeader from './S3FilesTableHeader'
import S3FileCommandDialogs from './S3FileCommandDialogs'
import { useUserController } from 'hooks/userController'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { useState } from 'react'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'

const S3FilesTable = ({
  s3Controller,
  data,
  folder,
  allFolders,
  onReloadFolder,
  onLocalDataMutate,
  showTableHeader = true,
  allowMoveFile,
  showFileAttributes,
}: {
  s3Controller: S3Controller
  data: S3Object[]
  folder: DropdownItem
  allFolders: DropdownItem[]
  onReloadFolder?: (targetFolder: DropdownItem) => Promise<void>
  onLocalDataMutate: (folder: DropdownItem, files: S3Object[]) => void
  showTableHeader?: boolean
  allowMoveFile: boolean
  showFileAttributes?: boolean
}) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [searchWithinList, setSearchWithinList] = useState('')
  const targetFolders = allFolders.filter((m) => m.text !== folder.text)
  const { uiState, dispatch, uiDefaultState } = s3Controller
  const { authProfile, setProfile } = useUserController()

  const filterList = (items: S3Object[]) => {
    if (searchWithinList.length === 0) {
      return [...items]
    }
    return items.filter((m) => m.filename.toLowerCase().includes(searchWithinList.toLowerCase()))
  }

  const results = filterList(data)

  const handleViewFile = async (item: S3Object) => {
    setIsWaiting(true)
    const url = await getPresignedUrl(item.bucket, item.fullPath)
    setProfile({ ...authProfile!, settings: { ...authProfile!.settings, selectedFolder: folder } })
    dispatch({ type: 'update', payload: { ...uiState, signedUrl: url, selectedItem: item } })
    setIsWaiting(false)
  }
  const handleDelete = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, itemToDelete: item } })
  }
  const handleConfirmDelete = async () => {
    if (uiState.itemToDelete) {
      const item = { ...uiState.itemToDelete }
      setIsWaiting(true)

      await postDelete('/api/s3', item)
      dispatch({ type: 'reset', payload: { ...uiDefaultState, snackbarSuccessMessage: `deleting file: ${item.filename}` } })
      setIsWaiting(false)
      onLocalDataMutate(
        folder,
        [...data].filter((m) => m.fullPath !== item.fullPath),
      )
    }
  }

  const handleCancelViewFile = () => {
    dispatch({ type: 'reset', payload: uiDefaultState })
  }

  const handleOnRename = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, selectedItem: item, showRenameFileDialog: true } })
  }

  const handleRenameFile = async (newfilename: string) => {
    const newItem = { ...uiState.selectedItem! }
    if (newItem) {
      const oldPath = newItem.fullPath
      const newPath = `${newItem.fullPath.substring(0, newItem.fullPath.lastIndexOf('/'))}/${newfilename}`
      if (oldPath !== newPath) {
        newItem.fullPath = newPath
        newItem.filename = newfilename
        setIsWaiting(true)
        await renameS3File(newItem.bucket, oldPath, newPath)
        setIsWaiting(false)
      }
      const newFiles = data.filter((m) => m.filename !== uiState.selectedItem!.filename)
      dispatch({ type: 'update', payload: { ...uiState, selectedItem: newItem, showRenameFileDialog: false } })
      setSearchWithinList('')
      newFiles.unshift(newItem)
      onLocalDataMutate(folder, newFiles)
      onReloadFolder?.(folder)
    }
  }

  const handleSelectFile = (checked: boolean, file: S3Object) => {
    const existing = [...uiState.selectedItems]
    if (checked) {
      if (!existing.find((m) => m.fullPath === file.fullPath)) {
        existing.push(file)
        dispatch({ type: 'update', payload: { ...uiState, selectedItems: existing, targetFolder: targetFolders[0] } })
      }
    } else {
      dispatch({ type: 'update', payload: { ...uiState, selectedItems: existing.filter((m) => m.fullPath !== file.fullPath) } })
    }
  }
  const handleMoveSingleFile = (file: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, showMoveFilesDialog: true, selectedItems: [file], targetFolder: targetFolders[0] } })
  }

  const handleSelectTargetFolder = (val: string) => {
    const newTargetFolder = allFolders.find((m) => m.value === val)
    if (newTargetFolder) {
      dispatch({ type: 'update', payload: { ...uiState, targetFolder: newTargetFolder } })
    }
  }

  const handleMoveItemsToFolder = async () => {
    if (uiState.targetFolder) {
      setIsWaiting(true)
      const selectedItems = [...uiState.selectedItems]
      const targetFolder = { ...uiState.targetFolder }
      dispatch({ type: 'reset', payload: uiDefaultState })
      for (const f of selectedItems) {
        const oldPath = f.fullPath
        const newPath = `${targetFolder.value}/${f.filename}`

        const resp = await renameS3File(f.bucket, oldPath, newPath)
        if (resp.statusCode === 200) {
          onLocalDataMutate(
            folder,
            [...data].filter((m) => m.fullPath !== f.fullPath),
          )
          await sleep(250)
        }
        await sleep(500)
      }
      setIsWaiting(false)
      onReloadFolder?.(folder)
    }
  }
  const handleConfirmDeleteFiles = async () => {
    const selectedItems = [...uiState.selectedItems]
    setIsWaiting(true)
    dispatch({ type: 'reset', payload: uiDefaultState })
    for (const f of selectedItems) {
      const resp = await postDelete('/api/s3', f)
      if (resp.statusCode === 200) {
        onLocalDataMutate(
          folder,
          [...data].filter((m) => m.fullPath !== f.fullPath),
        )
        await sleep(250)
      }
      await sleep(500)
    }

    setIsWaiting(false)
    await onReloadFolder?.(folder)
  }

  const handleSetEditMode = () => {
    const newEditMode = !uiState.isEditEmode
    dispatch({ type: 'update', payload: { ...uiState, targetFolder: newEditMode ? targetFolders[0] : null, isEditEmode: newEditMode, selectedItems: [] } })
  }
  const handleShowDeleteFilesDialog = (show: boolean) => {
    dispatch({ type: 'update', payload: { ...uiState, showDeleteFilesDialog: show } })
  }

  const handleCloseMoveFilesDialog = () => {
    dispatch({ type: 'update', payload: { ...uiState, showMoveFilesDialog: false } })
  }
  const handleCloseRenameFileDialog = () => {
    dispatch({ type: 'update', payload: { ...uiState, showRenameFileDialog: false } })
  }

  const handleCloseDeleteFileDialog = () => {
    dispatch({ type: 'update', payload: { ...uiState, itemToDelete: null } })
  }

  const handleSearchWithinListChanged = (text: string) => setSearchWithinList(text)

  const handleShowMoveItemsDialog = () => {
    dispatch({ type: 'update', payload: { ...uiState, targetFolder: targetFolders[0], showMoveFilesDialog: true } })
  }
  const handleRefresh = () => {
    onReloadFolder?.(folder)
  }

  return (
    <>
      {isWaiting && <BackdropLoader />}
      {showTableHeader && (
        <S3FilesTableHeader
          uiState={uiState}
          itemCount={data.length}
          onShowMoveFilesDialog={handleShowMoveItemsDialog}
          onSetEditMode={handleSetEditMode}
          onShowDeleteFilesDialog={handleShowDeleteFilesDialog}
          onRefresh={handleRefresh}
          handleSearchWithinListChanged={handleSearchWithinListChanged}
        />
      )}
      {results.length === 0 && <NoDataFound message='no data' />}
      {results.map((item) => (
        <Box key={item.fullPath} py={1}>
          <FadeIn>
            <S3FileRow
              isEditEmode={uiState.isEditEmode}
              file={item}
              onSelectFile={handleSelectFile}
              onViewFile={handleViewFile}
              onDelete={handleDelete}
              onRename={handleOnRename}
              onMovefile={handleMoveSingleFile}
              showMoveFile={allowMoveFile}
              showFileAttributes={showFileAttributes}
            />
          </FadeIn>
        </Box>
      ))}
      <S3FileCommandDialogs
        uiState={uiState}
        targetFolders={targetFolders}
        onCloseDeleteFileDialog={handleCloseDeleteFileDialog}
        onConfirmDelete={handleConfirmDelete}
        onCancelViewFile={handleCancelViewFile}
        onCloseRenameFileDialog={handleCloseRenameFileDialog}
        onRenameFile={handleRenameFile}
        onConfirmDeleteFiles={handleConfirmDeleteFiles}
        onShowDeleteFilesDialog={handleShowDeleteFilesDialog}
        onCloseMoveFilesDialog={handleCloseMoveFilesDialog}
        onSelectTargetFolder={handleSelectTargetFolder}
        onMoveItemsToFolder={handleMoveItemsToFolder}
      />
      {uiState.snackbarSuccessMessage && (
        <SnackbarSuccess
          show={!!uiState.snackbarSuccessMessage}
          text={uiState.snackbarSuccessMessage}
          onClose={() => {
            dispatch({ type: 'update', payload: { ...uiState, snackbarSuccessMessage: null } })
          }}
        />
      )}
    </>
  )
}

export default S3FilesTable

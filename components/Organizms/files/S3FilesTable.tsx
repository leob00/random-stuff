import { Box } from '@mui/material'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { postBody, postDelete } from 'lib/backend/api/fetchFunctions'
import { getPresignedUrl, getS3Files } from 'lib/backend/csr/nextApiWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { S3Controller } from 'hooks/s3/useS3Controller'
import { sleep } from 'lib/util/timers'
import S3FileRow from './S3FileRow'
import S3FilesTableHeader from './S3FilesTableHeader'
import S3FileCommandDialogs from './S3FileCommandDialogs'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { useState } from 'react'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'

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
  allowRename = false,
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
  allowRename?: boolean
}) => {
  //const [isWaiting, setIsWaiting] = useState(false)
  const [searchWithinList, setSearchWithinList] = useState('')
  const targetFolders = allFolders.filter((m) => m.text !== folder.text)
  const { uiState, dispatch, uiDefaultState } = s3Controller
  const [progressText, setProgressText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const filterList = (items: S3Object[]) => {
    if (searchWithinList.length === 0) {
      return [...items]
    }
    return items.filter((m) => m.filename.toLowerCase().includes(searchWithinList.toLowerCase()))
  }

  const results = filterList(data)

  const handleViewFile = async (item: S3Object) => {
    setError(null)
    setProgressText(`loading ${item.filename}`)
    dispatch({ type: 'update', payload: { ...uiState, snackbarSuccessMessage: 'loading file...' } })
    const resp = await getPresignedUrl(item)
    if (resp === 'unauthorized') {
      setError(`${resp}: try refreshing the page`)
      setProgressText(null)
      return
    }
    //setProfile({ ...authProfile!, settings: { ...authProfile!.settings, selectedFolder: folder } })
    dispatch({ type: 'update', payload: { ...uiState, signedUrl: resp, selectedItem: item, snackbarSuccessMessage: null } })
    setProgressText(null)
  }
  const handleDelete = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, itemToDelete: item } })
  }
  const handleConfirmDelete = async () => {
    setError(null)
    if (uiState.itemToDelete) {
      setProgressText(`deleting: ${uiState.itemToDelete.filename}`)
      const item = { ...uiState.itemToDelete }
      dispatch({ type: 'reset', payload: { ...uiDefaultState, snackbarSuccessMessage: `deleting file: ${item.filename}` } })
      await postBody('/api/aws/s3/item', 'DELETE', item)
      dispatch({ type: 'reset', payload: { ...uiDefaultState, snackbarSuccessMessage: null } })

      onLocalDataMutate(
        folder,
        [...data].filter((m) => m.fullPath !== item.fullPath),
      )
      await sleep(250)
      setProgressText(null)
    }
  }

  const handleCancelViewFile = () => {
    setError(null)
    dispatch({ type: 'reset', payload: uiDefaultState })
  }

  const handleOnRename = async (item: S3Object) => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, selectedItem: item, showRenameFileDialog: true } })
  }

  const handleRenameFile = async (newfilename: string) => {
    setError(null)
    const oldItem = { ...uiState.selectedItem! }
    const newPath = `${oldItem.fullPath.substring(0, oldItem.fullPath.lastIndexOf('/'))}/${newfilename}`

    const existingFiles = data.map((m) => m.filename)
    if (existingFiles.includes(newfilename)) {
      setError('file already exists. Please choose another name')
      return
    }
    dispatch({ type: 'update', payload: { ...uiState, selectedItem: null, showRenameFileDialog: false } })
    setProgressText(`renaming file to: ${newfilename}`)
    await postBody('/api/aws/s3/item/rename', 'POST', { oldItem: oldItem, newPath: newPath })
    const newFiles = await getS3Files(oldItem.bucket, folder.value)
    setSearchWithinList('')
    setProgressText(null)

    onLocalDataMutate(folder, newFiles)
  }

  const handleSelectFile = (checked: boolean, file: S3Object) => {
    setError(null)
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
    setError(null)
    const newTargetFolder = allFolders.find((m) => m.value === val)
    if (newTargetFolder) {
      dispatch({ type: 'update', payload: { ...uiState, targetFolder: newTargetFolder } })
    }
  }

  const handleMoveItemsToFolder = async () => {
    setError(null)
  }
  const handleConfirmDeleteFiles = async () => {
    setError(null)
    const selectedItems = [...uiState.selectedItems]
    setProgressText(`removing ${selectedItems.length} files...`)

    dispatch({ type: 'reset', payload: { ...uiDefaultState, snackbarSuccessMessage: 'processing...' } })
    for (const f of selectedItems) {
      const resp = await postBody('/api/aws/s3/item', 'DELETE', f)
      if (resp.statusCode === 200) {
        onLocalDataMutate(
          folder,
          [...data].filter((m) => m.fullPath !== f.fullPath),
        )
        await sleep(250)
      }
      await sleep(500)
    }

    setProgressText(null)
    await onReloadFolder?.(folder)
  }

  const handleSetEditMode = () => {
    setError(null)
    const newEditMode = !uiState.isEditEmode
    dispatch({ type: 'update', payload: { ...uiState, targetFolder: newEditMode ? targetFolders[0] : null, isEditEmode: newEditMode, selectedItems: [] } })
  }
  const handleShowDeleteFilesDialog = (show: boolean) => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, showDeleteFilesDialog: show } })
  }

  const handleCloseMoveFilesDialog = () => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, showMoveFilesDialog: false } })
  }
  const handleCloseRenameFileDialog = () => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, showRenameFileDialog: false } })
  }

  const handleCloseDeleteFileDialog = () => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, itemToDelete: null } })
  }

  const handleSearchWithinListChanged = (text: string) => setSearchWithinList(text)

  const handleShowMoveItemsDialog = () => {
    setError(null)
    dispatch({ type: 'update', payload: { ...uiState, targetFolder: targetFolders[0], showMoveFilesDialog: true } })
  }
  const handleRefresh = () => {
    setError(null)
    onReloadFolder?.(folder)
  }

  return (
    <>
      {error && <ErrorMessage text={error} />}
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
      {!!progressText && <ProgressDrawer isOpen={!!progressText} message={progressText} />}
    </>
  )
}

export default S3FilesTable

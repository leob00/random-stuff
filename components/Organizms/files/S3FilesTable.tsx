import { Box, Button, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import RenameFileDialog from 'components/Molecules/Forms/Files/RenameFileDialog'
import ViewS3FileDialog from 'components/Molecules/Forms/Files/ViewS3FileDialog'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { post, postDelete } from 'lib/backend/api/fetchFunctions'
import { renameS3File } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'
import FileMenu from './FileMenu'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { DropdownItem } from 'lib/models/dropdown'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuMove from 'components/Molecules/Menus/ContextMenuMove'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import CenterStack from 'components/Atoms/CenterStack'
import { S3Controller } from 'hooks/s3/useS3Controller'
import { sleep } from 'lib/util/timers'

const S3FilesTable = ({
  s3Controller,
  data,
  folder,
  allFolders,
  onMoveItems,
  onMutated,
  onDeleted,
}: {
  s3Controller: S3Controller
  data: S3Object[]
  folder: DropdownItem
  allFolders: DropdownItem[]
  onMoveItems: (items: S3Object[], targetFolder: DropdownItem) => void
  onMutated?: () => void
  onDeleted?: (item: S3Object) => void
}) => {
  const [isMutating, setIsMutating] = React.useState(false)
  const [searchWithinList, setSearchWithinList] = React.useState('')
  const targetFolders = allFolders.filter((m) => m.text !== folder.text)
  const { uiState, dispatch, uiDefaultState } = s3Controller

  const filterList = (items: S3Object[]) => {
    if (searchWithinList.length === 0) {
      return [...items]
    }
    return items.filter((m) => m.filename.toLowerCase().includes(searchWithinList.toLowerCase()))
  }

  const results = filterList(data)

  const handleViewFile = async (item: S3Object) => {
    setIsMutating(true)
    const params = { bucket: item.bucket, fullPath: item.fullPath, expiration: 600 }
    const url = JSON.parse(await post(`/api/s3`, params)) as string
    dispatch({ type: 'update', payload: { ...uiState, signedUrl: url, selectedItem: item } })
    setIsMutating(false)
  }
  const handleDelete = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, itemToDelete: item } })
  }
  const handleConfirmDelete = async () => {
    if (uiState.itemToDelete) {
      const item = { ...uiState.itemToDelete }
      setIsMutating(true)
      await postDelete('/api/s3', item)
      setIsMutating(false)
      dispatch({ type: 'reset', payload: uiDefaultState })
      onDeleted?.(item)
      onMutated?.()
    }
  }

  const handleCancelViewFile = () => {
    dispatch({ type: 'reset', payload: uiDefaultState })
  }

  const handleOnRename = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, selectedItem: item, showRenameFileDialog: true } })
  }

  const handleRenameFile = async (oldfilename: string, newfilename: string) => {
    const selectedItem = uiState.selectedItem
    if (selectedItem) {
      setIsMutating(true)
      const oldPath = selectedItem.fullPath
      const newPath = `${selectedItem.fullPath.substring(0, selectedItem.fullPath.lastIndexOf('/'))}/${newfilename}`
      await renameS3File(selectedItem.bucket, oldPath, newPath)
      dispatch({ type: 'reset', payload: uiDefaultState })
      setIsMutating(false)
      setSearchWithinList('')
      onMutated?.()
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

  const handleSelectTargetFolder = (val: string) => {
    const newTargetFolder = allFolders.find((m) => m.value === val)
    if (newTargetFolder) {
      dispatch({ type: 'update', payload: { ...uiState, targetFolder: newTargetFolder } })
    }
  }

  const handleMoveItemsToFolder = async () => {
    if (uiState.targetFolder) {
      const selectedItems = [...uiState.selectedItems]
      const targetFolder = { ...uiState.targetFolder }
      setIsMutating(true)
      for (const f of selectedItems) {
        const oldPath = f.fullPath
        const newPath = `${targetFolder.value}/${f.filename}`
        // console.log(`old path: ${oldPath}`)
        // console.log(`new path: ${newPath}`)
        await renameS3File(f.bucket, oldPath, newPath)
        dispatch({
          type: 'update',
          payload: { ...uiState, showMoveFilesDialog: false, targetFolder: null, selectedItems: selectedItems.filter((m) => m.fullPath !== f.fullPath) },
        })
        await sleep(250)
      }

      setIsMutating(false)
      await sleep(250)
      onMoveItems(selectedItems, targetFolder)

      dispatch({ type: 'reset', payload: uiDefaultState })
    }
  }

  const handleSetEditMode = () => {
    const newEditMode = !uiState.isEditEmode
    dispatch({ type: 'update', payload: { ...uiState, targetFolder: newEditMode ? targetFolders[0] : null, isEditEmode: newEditMode } })
  }

  const multiFileCommands: ContextMenuItem[] = [
    {
      item: <ContextMenuMove text='move' />,
      fn: () => {
        dispatch({ type: 'update', payload: { ...uiState, targetFolder: targetFolders[0], showMoveFilesDialog: true } })
      },
    },
    {
      item: <ContextMenuDelete text='delete' />,
      fn: () => {},
    },
  ]

  return (
    <>
      {isMutating && <BackdropLoader />}

      <Box>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          {!uiState.isEditEmode && <Box>{data.length > 3 && <SearchWithinList onChanged={(text: string) => setSearchWithinList(text)} />}</Box>}
          {data.length > 0 && (
            <Button size='small' onClick={handleSetEditMode}>
              {`${uiState.isEditEmode ? 'Cancel' : 'Edit'}`}
            </Button>
          )}
          {uiState.isEditEmode && uiState.selectedItems.length > 0 && (
            <Box>
              <ContextMenu items={multiFileCommands} />
            </Box>
          )}
        </Box>
      </Box>

      {results.map((item) => (
        <Box key={item.fullPath}>
          <Box py={1}>
            <ListItemContainer>
              <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                  {uiState.isEditEmode && (
                    <Box>
                      <SecondaryCheckbox onChanged={(checked: boolean) => handleSelectFile(checked, item)} />
                    </Box>
                  )}
                  <Box>
                    <Typography>{item.filename.substring(0, item.filename.lastIndexOf('.'))}</Typography>
                  </Box>
                </Box>
                <Box>{!uiState.isEditEmode && <FileMenu item={item} onView={handleViewFile} onDelete={handleDelete} onRename={handleOnRename} />}</Box>
              </Box>
            </ListItemContainer>
          </Box>
        </Box>
      ))}
      {uiState.itemToDelete && (
        <ConfirmDeleteDialog
          show={true}
          text={`Are you sure you want to delete ${uiState.itemToDelete.filename}?`}
          onCancel={() => dispatch({ type: 'update', payload: { ...uiState, itemToDelete: null } })}
          onConfirm={handleConfirmDelete}
        />
      )}
      {uiState.signedUrl && uiState.selectedItem && (
        <ViewS3FileDialog onCancel={handleCancelViewFile} signedUrl={uiState.signedUrl} filename={uiState.selectedItem.filename} />
      )}
      {uiState.showRenameFileDialog && uiState.selectedItem && (
        <RenameFileDialog
          filename={uiState.selectedItem.filename}
          onCancel={() => dispatch({ type: 'update', payload: { ...uiState, showRenameFileDialog: false } })}
          onSubmitted={handleRenameFile}
        />
      )}
      <FormDialog
        show={uiState.showMoveFilesDialog}
        onCancel={() => dispatch({ type: 'update', payload: { ...uiState, showMoveFilesDialog: false } })}
        title={'move files'}
        showActionButtons
      >
        <CenterStack>
          <Typography>{`Move ${uiState.selectedItems.length} files to folder of your choice:`}</Typography>
        </CenterStack>
        {uiState.targetFolder && (
          <Box py={2}>
            <DropdownList options={targetFolders} selectedOption={uiState.targetFolder.value} onOptionSelected={handleSelectTargetFolder} fullWidth />
          </Box>
        )}
        <Box pb={2}>
          <CenterStack>
            <PrimaryButton text='move' onClick={handleMoveItemsToFolder} />
          </CenterStack>
        </Box>
      </FormDialog>
    </>
  )
}

export default S3FilesTable

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
  const [itemToDelete, setItemToDelete] = React.useState<S3Object | null>(null)
  const [showRenameForm, setShowRenameForm] = React.useState(false)
  const [isMutating, setIsMutating] = React.useState(false)
  const [searchWithinList, setSearchWithinList] = React.useState('')
  //const [showEditMode, seShowEditModel] = React.useState(false)
  const [showMoveDialog, setShowMoveDialog] = React.useState(false)

  const targetFolders = allFolders.filter((m) => m.text !== folder.text)
  const { uiState, dispatch, uiDefaultState } = s3Controller

  const filterList = (items: S3Object[]) => {
    if (searchWithinList.length === 0) {
      return items
    }
    return items.filter((m) => m.filename.toLowerCase().includes(searchWithinList.toLowerCase()))
  }

  const results = filterList(data)

  const handleViewFile = async (item: S3Object) => {
    setIsMutating(true)

    const params = { bucket: item.bucket, fullPath: item.fullPath, expiration: 600 }
    const url = JSON.parse(await post(`/api/s3`, params)) as string
    dispatch({ type: 'update', payload: { ...uiState, signedUrl: url, isEditEmode: false, viewFile: item } })
    setIsMutating(false)
  }
  const handleDelete = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, isEditEmode: false } })
    setItemToDelete(item)
  }
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const item = { ...itemToDelete }
      setItemToDelete(null)
      setIsMutating(true)
      await postDelete('/api/s3', item)
      setIsMutating(false)
      dispatch({ type: 'update', payload: { ...uiState, isEditEmode: false, selectedItems: [] } })
      onDeleted?.(item)
      onMutated?.()
    }
  }

  const handleCancelViewFile = () => {
    dispatch({ type: 'update', payload: { ...uiState, signedUrl: null, viewFile: null } })
  }

  const handleOnRename = async (item: S3Object) => {
    dispatch({ type: 'update', payload: { ...uiState, viewFile: item } })
    setShowRenameForm(true)
  }

  const handleRenameFile = async (oldfilename: string, newfilename: string) => {
    const selectedItem = uiState.selectedItem
    if (selectedItem) {
      setShowRenameForm(false)
      setIsMutating(true)
      const oldPath = selectedItem.fullPath
      const newPath = `${selectedItem.fullPath.substring(0, selectedItem.fullPath.lastIndexOf('/'))}/${newfilename}`
      await renameS3File(selectedItem.bucket, oldPath, newPath)
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
        dispatch({ type: 'update', payload: { ...uiState, selectedItems: existing } })
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

  const handleMoveItemsToFolder = () => {
    if (uiState.targetFolder) {
      setShowMoveDialog(false)
      dispatch({ type: 'update', payload: uiDefaultState })

      //onMoveItems(uiState.selectedItems, uiState.targetFolder)
    }
  }

  const handleSetEditMode = () => {
    //dispatch({ type: 'updateSelectedItems', payload: [] })
    const newEditMode = !uiState.isEditEmode
    if (newEditMode) {
      //dispatch({ type: 'updateTargetFolder', payload: targetFolders[0] })
      dispatch({ type: 'update', payload: { ...uiState, targetFolder: newEditMode ? targetFolders[0] : null, isEditEmode: newEditMode } })
    }
  }

  const multiFileCommands: ContextMenuItem[] = [
    {
      item: <ContextMenuMove text='move' />,
      fn: () => {
        dispatch({ type: 'update', payload: { ...uiState, targetFolder: targetFolders[0] } })
        setShowMoveDialog(true)
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
      {itemToDelete && (
        <ConfirmDeleteDialog
          show={true}
          text={`Are you sure you want to delete ${itemToDelete.filename}?`}
          onCancel={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {uiState.signedUrl && uiState.viewFile && (
        <ViewS3FileDialog onCancel={handleCancelViewFile} signedUrl={uiState.signedUrl} filename={uiState.viewFile.filename} />
      )}
      {showRenameForm && uiState.selectedItem && (
        <RenameFileDialog filename={uiState.selectedItem.filename} onCancel={() => setShowRenameForm(false)} onSubmitted={handleRenameFile} />
      )}
      <FormDialog show={showMoveDialog} onCancel={() => setShowMoveDialog(false)} title={'move files'} showActionButtons>
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

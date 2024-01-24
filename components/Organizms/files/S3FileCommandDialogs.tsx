import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import RenameFileDialog from 'components/Molecules/Forms/Files/RenameFileDialog'
import ViewS3FileDialog from 'components/Molecules/Forms/Files/ViewS3FileDialog'
import { S3DisplayState } from 'hooks/s3/useS3DisplayState'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import S3MoveFilesDialog from './S3MoveFilesDialog'

const S3FileCommandDialogs = ({
  uiState,
  targetFolders,
  onCloseDeleteFileDialog,
  onConfirmDelete,
  onCancelViewFile,
  onCloseRenameFileDialog,
  onRenameFile,
  onShowDeleteFilesDialog,
  onConfirmDeleteFiles,
  onCloseMoveFilesDialog,
  onSelectTargetFolder,
  onMoveItemsToFolder,
}: {
  uiState: S3DisplayState
  targetFolders: DropdownItem[]
  onCloseDeleteFileDialog: () => void
  onConfirmDelete: () => void
  onCancelViewFile: () => void
  onCloseRenameFileDialog: () => void
  onRenameFile: (newFileName: string) => void
  onShowDeleteFilesDialog: (show: boolean) => void
  onConfirmDeleteFiles: () => void
  onCloseMoveFilesDialog: () => void
  onSelectTargetFolder: (val: string) => void
  onMoveItemsToFolder: () => void
}) => {
  return (
    <>
      {uiState.itemToDelete && <ConfirmDeleteDialog show={true} text={`Are you sure you want to delete ${uiState.itemToDelete.filename}?`} onCancel={onCloseDeleteFileDialog} onConfirm={onConfirmDelete} />}
      {uiState.signedUrl && uiState.selectedItem && <ViewS3FileDialog onCancel={onCancelViewFile} signedUrl={uiState.signedUrl} filename={uiState.selectedItem.filename} />}
      {uiState.showRenameFileDialog && uiState.selectedItem && <RenameFileDialog filename={uiState.selectedItem.filename} onCancel={onCloseRenameFileDialog} onSubmitted={onRenameFile} />}
      {uiState.showDeleteFilesDialog && uiState.selectedItems.length > 0 && (
        <ConfirmDeleteDialog show={true} onCancel={() => onShowDeleteFilesDialog(false)} onConfirm={onConfirmDeleteFiles} title='confirm delete' text={`Are you sure you want to delete all selected files?`} />
      )}
      <S3MoveFilesDialog
        show={uiState.showMoveFilesDialog}
        targetFolders={targetFolders}
        targetFolder={uiState.targetFolder}
        selectedFiles={uiState.selectedItems}
        onClose={onCloseMoveFilesDialog}
        onSelectTargetFolder={onSelectTargetFolder}
        onMoveItems={onMoveItemsToFolder}
      />
    </>
  )
}

export default S3FileCommandDialogs

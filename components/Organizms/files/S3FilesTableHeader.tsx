import { Box, IconButton, Paper } from '@mui/material'
import { S3DisplayState } from 'hooks/s3/useS3DisplayState'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuMove from 'components/Molecules/Menus/ContextMenuMove'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const S3FilesTableHeader = ({
  uiState,
  itemCount,
  onSetEditMode,
  onShowMoveFilesDialog,
  onShowDeleteFilesDialog,
  handleSearchWithinListChanged,
  onRefresh,
}: {
  uiState: S3DisplayState
  itemCount: number
  onSetEditMode: () => void
  onShowMoveFilesDialog: () => void
  onShowDeleteFilesDialog: (show: boolean) => void
  handleSearchWithinListChanged: (text: string) => void
  onRefresh: () => void
}) => {
  const multiFileCommands: ContextMenuItem[] = [
    {
      item: <ContextMenuMove text='move' />,
      fn: () => {
        onShowMoveFilesDialog()
      },
    },
    {
      item: <ContextMenuDelete text='delete' />,
      fn: () => {
        onShowDeleteFilesDialog(true)
      },
    },
  ]

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          {!uiState.isEditEmode && itemCount > 3 && (
            <FadeIn>
              <SearchWithinList onChanged={handleSearchWithinListChanged} />
            </FadeIn>
          )}
          {uiState.isEditEmode && uiState.selectedItems.length > 0 && (
            <Box>
              <ContextMenu items={multiFileCommands} />
            </Box>
          )}
        </Box>
        {!uiState.isEditEmode && (
          <Box>
            <IconButton color='primary' size='small' onClick={onRefresh}>
              <RefreshIcon fontSize='small' />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box pt={2}>
        <HorizontalDivider />
      </Box>
      <Box>
        {itemCount > 0 && (
          <Box display={'flex'} justifyContent={'flex-end'}>
            <IconButton color='primary' size='small' onClick={onSetEditMode}>
              {uiState.isEditEmode ? <EditOffIcon fontSize='small' /> : <EditIcon fontSize='small' elevation={2} />}
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default S3FilesTableHeader

import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import dayjs from 'dayjs'
import React from 'react'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import NoteFiles from './notes/NoteFiles'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuClose from 'components/Molecules/Menus/ContextMenuClose'
import { S3Object, UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'

const ViewNote = ({
  selectedNote,
  onEdit,
  onCancel,
  onDelete,
  onFilesMutated,
}: {
  selectedNote: UserNote
  onEdit: (item: UserNote) => void
  onCancel: () => void
  onDelete: (note: UserNote) => void
  onFilesMutated: (files: S3Object[]) => void
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleYesDelete = () => {
    onDelete(selectedNote)
  }
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuClose />,
      fn: onCancel,
    },
    {
      item: <ContextMenuEdit />,
      fn: () => onEdit(selectedNote),
    },
    {
      item: <ContextMenuDelete />,
      fn: () => setShowConfirmDelete(true),
    },
  ]

  return (
    <>
      <Box sx={{ py: 1 }}>
        <CenteredTitle title={`${selectedNote.title}`} />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
        <CenterStack>
          <HtmlView html={selectedNote.body} />
        </CenterStack>
        <CenterStack>
          <Typography variant='body1'>{`updated: ${dayjs(selectedNote.dateModified).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </CenterStack>
        {selectedNote.expirationDate && (
          <CenterStack>
            <Stack sx={{ py: 4 }} display={'flex'} direction={'row'} justifyItems={'center'}>
              <RecordExpirationWarning expirationDate={selectedNote.expirationDate} />
            </Stack>
          </CenterStack>
        )}
        {/* <HorizontalDivider />
        <Box pt={2}>
          <NoteFiles files={selectedNote.attachments} onMutated={onFilesMutated} />
        </Box> */}
      </Box>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        title={'confirm delete'}
        text={'Are you sure you want to delete this note?'}
        onConfirm={handleYesDelete}
        onCancel={() => {
          setShowConfirmDelete(false)
        }}
      />
    </>
  )
}

export default ViewNote

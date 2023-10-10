import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import NoteFiles from './notes/NoteFiles'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuClose from 'components/Molecules/Menus/ContextMenuClose'
import { S3Object } from 'lib/backend/api/aws/apiGateway'

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
      {/* <EditItemToolbar
        onCancel={onCancel}
        onEdit={() => {
          onEdit(selectedNote)
        }}
        onDelete={() => {
          setShowConfirmDelete(true)
        }}
      /> */}
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
        <HorizontalDivider />
        <Box pt={2}>
          <NoteFiles files={selectedNote.attachments} onMutated={onFilesMutated} />
        </Box>
        {/* <CenterStack sx={{ py: 2, gap: 2 }}>
          <SecondaryButton
            size='small'
            width={70}
            text='edit'
            onClick={() => {
              onEdit(selectedNote)
            }}
            sx={{ ml: 2 }}
          ></SecondaryButton>
          <DangerButton
            text={'delete'}
            size='small'
            width={70}
            onClick={() => {
              setShowConfirmDelete(true)
            }}
          />
          <PassiveButton size='small' width={70} onClick={onCancel} text='close' />
        </CenterStack> */}
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

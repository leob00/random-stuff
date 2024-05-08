import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import dayjs from 'dayjs'
import React from 'react'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuClose from 'components/Molecules/Menus/ContextMenuClose'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const ViewNote = ({ selectedNote, onEdit, onCancel, onDelete }: { selectedNote: UserNote; onEdit: (item: UserNote) => void; onCancel: () => void; onDelete: (note: UserNote) => void }) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleYesDelete = () => {
    setShowConfirmDelete(false)
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
        <ScrollIntoView enabled={true} />
        <CenteredHeader title={selectedNote.title} />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
        <ScrollableBox>
          <CenterStack>
            <HtmlView html={selectedNote.body} />
          </CenterStack>
        </ScrollableBox>
        <HorizontalDivider />
        <CenterStack>
          <Typography variant='body2'>{`created: ${dayjs(selectedNote.dateCreated).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </CenterStack>
        <CenterStack sx={{ pt: 2 }}>
          <Typography variant='body2'>{`updated: ${dayjs(selectedNote.dateModified).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </CenterStack>
        {selectedNote.expirationDate && (
          <CenterStack>
            <Stack sx={{ py: 4 }} display={'flex'} direction={'row'} justifyItems={'center'}>
              <RecordExpirationWarning expirationDate={selectedNote.expirationDate} />
            </Stack>
          </CenterStack>
        )}
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

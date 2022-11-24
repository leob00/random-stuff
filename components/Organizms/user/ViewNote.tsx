import { Box, Stack, Typography } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const ViewNote = ({
  selectedNote,
  onEdit,
  onCancel,
  onDelete,
}: {
  selectedNote: UserNote
  onEdit: (item: UserNote) => void
  onCancel: () => void
  onDelete: (note: UserNote) => void
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleYesDelete = () => {
    onDelete(selectedNote)
  }

  return (
    <>
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        title={'confirm delete'}
        text={'Are you sure you want to delete this note?'}
        onConfirm={handleYesDelete}
        onCancel={() => {
          setShowConfirmDelete(false)
        }}
      />
      <EditItemToolbar
        onCancel={onCancel}
        onEdit={() => {
          onEdit(selectedNote)
        }}
        onDelete={() => {
          setShowConfirmDelete(true)
        }}
      />
      <Box sx={{ py: 1 }}>
        <CenteredTitle title={`${selectedNote.title}`} />
        <CenterStack>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: selectedNote.body }}></Typography>
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
        <CenterStack sx={{ py: 2, gap: 2 }}>
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
        </CenterStack>
      </Box>
    </>
  )
}

export default ViewNote

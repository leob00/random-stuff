import { Create, Close } from '@mui/icons-material'
import { Box, Typography, Divider, Button, Stack, IconButton } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import EditItemToolbar from 'components/Molecules/EditItemToolbar'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const ViewNote = ({ selectedNote, onEdit, onCancel }: { selectedNote: UserNote; onEdit: (item: UserNote) => void; onCancel: () => void }) => {
  return (
    <>
      <EditItemToolbar
        onCancel={onCancel}
        onEdit={() => {
          onEdit(selectedNote)
        }}
      />

      <Box sx={{ py: 2 }}>
        <CenterStack sx={{ py: 2 }}>
          <Typography variant='h5'>{`${selectedNote.title}`}</Typography>
        </CenterStack>
        <CenterStack sx={{}}>
          <Typography variant='body2'>{`updated: ${dayjs(selectedNote.dateModified).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </CenterStack>
        <CenterStack sx={{ py: 2 }}>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: selectedNote.body }}></Typography>
        </CenterStack>
        <Divider sx={{ pb: 4 }} />
        <CenterStack sx={{ py: 2, gap: 2 }}>
          <PassiveButton onClick={onCancel} text='close' />
          <PrimaryButton
            text='edit'
            onClick={() => {
              onEdit(selectedNote)
            }}
            sx={{ ml: 2 }}
          ></PrimaryButton>
        </CenterStack>
      </Box>
    </>
  )
}

export default ViewNote

import { Box, Typography, Divider, Button } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const ViewNote = ({ selectedNote, onEdit, onCancel }: { selectedNote: UserNote; onEdit: (item: UserNote) => void; onCancel: () => void }) => {
  return (
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
      <CenterStack sx={{ py: 2 }}>
        <Button color='secondary' variant='outlined' onClick={onCancel}>
          close
        </Button>
        <PrimaryButton
          text='edit'
          onClick={() => {
            onEdit(selectedNote)
          }}
          sx={{ ml: 2 }}
        ></PrimaryButton>
      </CenterStack>
    </Box>
  )
}

export default ViewNote

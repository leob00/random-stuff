import Check from '@mui/icons-material/Check'
import { Button, Stack, Typography } from '@mui/material'
import router from 'next/router'
import React from 'react'

const SavedNoteButtonLink = () => {
  return (
    <Stack justifyContent={'center'} direction='row' spacing={1} alignItems={'center'}>
      <Button
        variant='outlined'
        color='success'
        size='small'
        onClick={() => {
          router.push('/protected/csr/notes')
        }}
      >
        <Check fontSize='small' sx={{ mr: 1 }} />
        <Typography color='success' fontSize={'small'}>
          saved
        </Typography>
      </Button>
    </Stack>
  )
}

export default SavedNoteButtonLink

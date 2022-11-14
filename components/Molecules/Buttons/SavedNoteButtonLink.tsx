import { Check } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import router from 'next/router'
import React from 'react'

const SavedNoteButtonLink = () => {
  return (
    <Button
      color='success'
      size='small'
      onClick={() => {
        router.push('/protected/csr/notes')
      }}
    >
      <Check fontSize='small' sx={{ mr: 1 }} />
      saved
    </Button>
  )
}

export default SavedNoteButtonLink

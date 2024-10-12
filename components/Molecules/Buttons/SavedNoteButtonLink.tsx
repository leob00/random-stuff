import Check from '@mui/icons-material/Check'
import { Button, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import router from 'next/router'
import React from 'react'

const SavedNoteButtonLink = () => {
  return (
    <Stack justifyContent={'center'} direction='row' spacing={1} alignItems={'center'}>
      <Check fontSize='small' sx={{ mr: 1 }} color='success' />
      <LinkButton
        onClick={() => {
          router.push('/protected/csr/notes')
        }}
      >
        <Typography>{'view in notes'}</Typography>
      </LinkButton>
    </Stack>
  )
}

export default SavedNoteButtonLink

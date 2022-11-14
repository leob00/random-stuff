import { Check, QuestionAnswerOutlined, QuestionMarkOutlined, QuestionMarkRounded } from '@mui/icons-material'
import { Button, Stack, Tooltip, Typography } from '@mui/material'
import ExprationWarningTooltip from 'components/Atoms/Tooltips/ExprationWarningTooltip'
import router from 'next/router'
import React from 'react'

const SavedNoteButtonLink = () => {
  return (
    <Stack justifyContent={'center'} direction='row' spacing={1}>
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
      <ExprationWarningTooltip>
        <QuestionAnswerOutlined fontSize='small' />
      </ExprationWarningTooltip>
    </Stack>
  )
}

export default SavedNoteButtonLink

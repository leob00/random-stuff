import { Warning } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getExpirationText, getUtcNow } from 'lib/util/dateUtil'
import React from 'react'

const RecordExpirationWarning = ({ expirationDate, precise = false }: { expirationDate: string; precise?: boolean }) => {
  let message = getExpirationText(expirationDate, precise)

  return (
    <>
      <Typography pr={1}>
        <Warning fontSize='small' color='warning' />
      </Typography>
      <Typography pr={1} variant='body2'>
        {message}
      </Typography>
    </>
  )
}

export default RecordExpirationWarning

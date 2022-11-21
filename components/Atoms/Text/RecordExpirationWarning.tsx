import { Warning } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const RecordExpirationWarning = ({ expirationDate }: { expirationDate?: string }) => {
  return (
    <>
      {expirationDate && (
        <>
          <Typography pr={1}>
            <Warning fontSize='small' color='warning' />
          </Typography>
          <Typography pr={1} variant='body2'>{`this record will expire on ${dayjs(expirationDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </>
      )}
    </>
  )
}

export default RecordExpirationWarning

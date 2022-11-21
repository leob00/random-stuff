import { Warning } from '@mui/icons-material'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const RecordExpirationWarning = ({ expirationDate }: { expirationDate?: string }) => {
  return (
    <>
      <Typography pr={1}>
        <Warning fontSize='small' color='warning' />
      </Typography>
      <Typography pr={1} variant='body2'>{`this record is set to expire on ${dayjs(expirationDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
    </>
  )
}

export default RecordExpirationWarning

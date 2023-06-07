import Warning from '@mui/icons-material/Warning'
import { Typography } from '@mui/material'
import { getExpirationText } from 'lib/util/dateUtil'
import React from 'react'

const RecordExpirationWarning = ({ expirationDate, precise = false }: { expirationDate: string; precise?: boolean }) => {
  let message = getExpirationText(expirationDate, precise)

  return (
    <>
      <Typography pr={1}>
        <Warning fontSize='small' color='primary' />
      </Typography>
      <Typography pr={1} variant='body2'>
        {message}
      </Typography>
    </>
  )
}

export default RecordExpirationWarning

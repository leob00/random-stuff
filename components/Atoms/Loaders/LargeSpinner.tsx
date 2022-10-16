import { CircularProgress } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'

const LargeSpinner = () => {
  return (
    <CenterStack sx={{ py: 2 }}>
      <CircularProgress color='secondary' />
    </CenterStack>
  )
}

export default LargeSpinner

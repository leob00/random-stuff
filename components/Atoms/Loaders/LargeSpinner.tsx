import { CircularProgress } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'

const LargeSpinner = () => {
  return (
    <CenterStack sx={{ py: 2 }}>
      <CircularProgress />
    </CenterStack>
  )
}

export default LargeSpinner

import { CircularProgress } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'

const LargeSpinner = () => {
  return (
    <CenterStack>
      <CircularProgress color='secondary' />
    </CenterStack>
  )
}

export default LargeSpinner

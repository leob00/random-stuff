import { LinearProgress } from '@mui/material'
import React from 'react'

const ProgressBar = ({ value, height = 10, width = 100 }: { value: number; height?: number; width?: number }) => {
  return <LinearProgress variant='determinate' value={value} color='success' sx={{ width: width, height: height }} />
}

export default ProgressBar

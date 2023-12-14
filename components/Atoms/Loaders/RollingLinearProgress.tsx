import { Stack, LinearProgress } from '@mui/material'
import React from 'react'

const RollingLinearProgress = ({ width = 100, height = 48 }: { width?: number; height?: number }) => {
  return (
    <Stack width={width} alignContent='center' justifyContent={'center'} pt={1} height={height}>
      <LinearProgress color='info' />
    </Stack>
  )
}

export default RollingLinearProgress

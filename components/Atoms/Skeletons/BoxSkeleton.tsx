import { Box, Skeleton, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const BoxSkeleton = ({ width = 210, height = 240 }: { width?: number; height?: number }) => {
  return (
    <Box px={1} pt={2} pb={1}>
      <Skeleton variant='rectangular' sx={{ bgcolor: VeryLightBlueTransparent }} animation='wave' width={'100%'}>
        <Box height={height}></Box>
      </Skeleton>
    </Box>
  )
}

export default BoxSkeleton

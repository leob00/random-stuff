import { Box, Skeleton, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import TextSkeleton from './TextSkeleton'

const LinesSkeleton = () => {
  return (
    <>
      <Box py={1}>
        <Skeleton sx={{ bgcolor: VeryLightBlueTransparent }} />
      </Box>
      <Box py={1}>
        <Skeleton animation='wave' sx={{ bgcolor: VeryLightBlueTransparent }} />
      </Box>
      <Box py={1}>
        <Skeleton sx={{ bgcolor: VeryLightBlueTransparent }} />
      </Box>
    </>
  )
}

export default LinesSkeleton

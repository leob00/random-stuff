import { Box, Skeleton, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { range } from 'lodash'
import React from 'react'

const LinesSkeleton = ({ lines = 3, width = '260px', height = 52 }: { lines?: number; width?: string | number; height?: string | number }) => {
  const r = range(0, lines)
  return (
    <Box px={1} py={1}>
      {r.map((item, index) => (
        <Box key={index}>
          <Skeleton
            variant='text'
            height={height}
            sx={{ bgcolor: VeryLightBlueTransparent }}
            animation={index < r.length - 1 ? 'pulse' : 'wave'}
            width={width}
          ></Skeleton>
        </Box>
      ))}
    </Box>
  )
}

export default LinesSkeleton

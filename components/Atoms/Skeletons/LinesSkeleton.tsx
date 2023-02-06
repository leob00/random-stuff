import { Box, Skeleton, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { range } from 'lodash'
import React from 'react'

const LinesSkeleton = ({ lines = 3 }: { lines?: number }) => {
  const r = range(0, lines)
  return (
    <Box px={1} py={1}>
      {r.map((item, index) => (
        <Box key={index}>
          <Typography variant='h6' width={'100%'}>
            <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent }} animation={index < r.length - 1 ? 'pulse' : 'wave'} width={'100%'}></Skeleton>
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default LinesSkeleton

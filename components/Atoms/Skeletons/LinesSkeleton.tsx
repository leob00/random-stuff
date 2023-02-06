import { Box, Skeleton, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { range } from 'lodash'
import React from 'react'

const LinesSkeleton = ({ lines = 4 }: { lines?: number }) => {
  const r = range(0, lines)
  return (
    <Box>
      {r.map((item, index) => (
        <Box key={index}>
          <Box py={1} px={2} width={'80%'} textAlign={'center'}>
            <Typography variant='h6'>
              <Skeleton sx={{ bgcolor: VeryLightBlueTransparent }} animation={index < r.length - 1 ? 'pulse' : 'wave'} />
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default LinesSkeleton

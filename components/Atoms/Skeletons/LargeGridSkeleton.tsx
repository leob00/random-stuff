import { Box, Paper } from '@mui/material'
import { range } from 'lodash'
import React from 'react'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import BoxSkeleton from './BoxSkeleton'

const LargeGridSkeleton = ({ rowCount = 5 }: { rowCount?: number }) => {
  const r = range(0, rowCount ?? 5)
  return (
    <>
      {r.map((item, i) => (
        <Box key={i}>
          <BoxSkeleton height={80} />
        </Box>
      ))}
      {/* // <BoxSkeleton height={100} />
      // <HorizontalDivider />
      // <BoxSkeleton height={100} />
      // <HorizontalDivider />
      // <BoxSkeleton height={100} /> */}
    </>
  )
}

export default LargeGridSkeleton

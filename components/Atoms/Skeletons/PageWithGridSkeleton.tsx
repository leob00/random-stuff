import { Box } from '@mui/material'
import { range } from 'lodash'
import React from 'react'
import WarmupBox from '../WarmupBox'
import TextSkeleton from './TextSkeleton'

const PageWithGridSkeleton = ({ rowCount = 6 }: { rowCount?: number }) => {
  const r = range(0, rowCount ?? 5)
  return (
    <>
      {r.map((item, i) => (
        <Box py={2} key={i}>
          <TextSkeleton />
        </Box>
      ))}
    </>
  )
}

export default PageWithGridSkeleton

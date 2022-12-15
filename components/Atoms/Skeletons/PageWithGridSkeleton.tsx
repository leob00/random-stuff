import { Box } from '@mui/material'
import React from 'react'
import WarmupBox from '../WarmupBox'
import TextSkeleton from './TextSkeleton'

const PageWithGridSkeleton = () => {
  return (
    <>
      <WarmupBox />
      <Box py={2}>
        <TextSkeleton />
      </Box>
      <Box py={2}>
        <TextSkeleton />
      </Box>
      <Box py={2}>
        <TextSkeleton />
      </Box>
      <Box py={2}>
        <TextSkeleton />
      </Box>
      <Box py={2}>
        <TextSkeleton />
      </Box>
    </>
  )
}

export default PageWithGridSkeleton

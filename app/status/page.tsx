import { Box, Typography, Stack } from '@mui/material'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <>
      <Suspense fallback={<>loading...</>}>
        <Box>
          <Typography>All is well!</Typography>
        </Box>
      </Suspense>
    </>
  )
}

export default Page

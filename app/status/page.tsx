import { Box, Typography, Stack } from '@mui/material'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <>
      <Suspense>
        <Box>
          <Typography>All is well!</Typography>
        </Box>
      </Suspense>
    </>
  )
}

export default Page

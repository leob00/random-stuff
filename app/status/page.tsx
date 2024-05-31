import React, { Suspense } from 'react'
import StatusSkeleton from './StatusSkeleton'
import StocksStatus from './StocksStatus'
import { Box } from '@mui/material'

export default async function Page() {
  return (
    <>
      <Box>
        <Suspense fallback={<StatusSkeleton />}>
          <StocksStatus />
        </Suspense>
        <Suspense fallback={<StatusSkeleton />}>
          <StocksStatus />
        </Suspense>
      </Box>
    </>
  )
}

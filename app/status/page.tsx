import React, { Suspense } from 'react'
import StatusSkeleton from './StatusSkeleton'
import StocksStatus from './StocksStatus'
import { Box } from '@mui/material'
import NewsStatus from './NewsStatus'
import PageHeader from 'components/Atoms/Containers/PageHeader'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='status' />
      <Box>
        <Suspense fallback={<StatusSkeleton />}>
          <StocksStatus />
        </Suspense>
        <Suspense fallback={<StatusSkeleton />}>
          <NewsStatus />
        </Suspense>
      </Box>
    </>
  )
}

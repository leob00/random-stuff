import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EarningsCalendarPage from './EarningsCalendarPage'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'

export default async function Page() {
  return (
    <>
      <PageHeader text='Earnings Calendar'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <EarningsCalendarPage />
        </Suspense>
      </Box>
    </>
  )
}

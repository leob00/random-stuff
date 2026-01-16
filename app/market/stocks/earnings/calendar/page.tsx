import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import EarningsCalendarPage from './EarningsCalendarPage'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Earnings Calendar' />
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

import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketSummaryPage from './StockMarketSummaryPage'
import Seo from 'components/Organizms/Seo'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Stock Market Summary' />
      <PageHeader text='Stock Market Summary'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <StockMarketSummaryPage />
        </Suspense>
      </Box>
    </>
  )
}

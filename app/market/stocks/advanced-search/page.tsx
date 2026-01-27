import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import { Suspense } from 'react'
import StocksAdvancedSearchPage from './StocksAdvancedSearchPage'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Stocks Advanced Search'}>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Suspense fallback={<ComponentLoader />}>
        <Box>
          <StocksAdvancedSearchPage />
        </Box>
      </Suspense>
    </>
  )
}

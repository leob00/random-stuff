import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import StocksPage from './StocksPage'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Stocks' />
      <PageHeader text='Stocks'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <StocksPage />
        </Suspense>
      </Box>
    </>
  )
}

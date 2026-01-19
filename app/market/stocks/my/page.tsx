import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import MyStocksPage from './MyStocksPage'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='My Stocks'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <MyStocksPage />
        </Suspense>
      </Box>
    </>
  )
}

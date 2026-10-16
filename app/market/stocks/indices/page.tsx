import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import StockIndicesPage from './StockIndicesPage'

export const dynamic = 'force-dynamic' // disable cache
//export const revalidate = 1800 // Revalidate every 30 minutes
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Stock Indices' />
      <PageHeader text='Stock Indices'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <StockIndicesPage />
        </Suspense>
      </Box>
    </>
  )
}

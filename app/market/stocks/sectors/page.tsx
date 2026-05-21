import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import { Suspense } from 'react'
import SectorsPage from './SectorsPage'
import Seo from 'components/Organizms/Seo'
export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Stock Reports' />
      <PageHeader text={'Stock Reports'}>
        <StockMarketPageContextMenu />
      </PageHeader>
      <Suspense fallback={<ComponentLoader />}>
        <Box>
          <SectorsPage />
        </Box>
      </Suspense>
    </>
  )
}

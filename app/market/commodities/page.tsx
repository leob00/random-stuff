import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

import Seo from 'components/Organizms/Seo'
import CommoditiesPage from './CommoditiesPage'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Commodities' />
      <PageHeader text='Commodities'>
        <OtherMarketsPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <CommoditiesPage />
        </Suspense>
      </Box>
    </>
  )
}

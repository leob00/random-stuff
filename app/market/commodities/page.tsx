import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

import CommoditiesPage from './CommoditiesPage'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'

//export const dynamic = 'force-dynamic' // disable cache
//export const revalidate = 600 // revalidate every 10 minutes
export default async function Page() {
  return (
    <>
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

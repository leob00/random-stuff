import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import TreasuriesPage from './TreasuriesPage'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'

//export const dynamic = 'force-dynamic' // disable cache
export const revalidate = 1800 // Revalidate every 30 minutes
export default async function Page() {
  return (
    <>
      <Seo pageTitle='U.S Treasury Yields' />
      <PageHeader text='U.S Treasury Yields'>
        <OtherMarketsPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <TreasuriesPage />
        </Suspense>
      </Box>
    </>
  )
}

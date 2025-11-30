import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import TreasuriesPage from './TreasuriesPage'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
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

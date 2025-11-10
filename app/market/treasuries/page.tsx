import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import TreasuriesView from './TreasuriesView'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='U.S Treasury Yields' />
      <Box>
        <Suspense fallback={<BackdropLoader />}>
          <TreasuriesView />
        </Suspense>
      </Box>
    </>
  )
}

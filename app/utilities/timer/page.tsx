import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import UtilitiesPageContextMenu from 'components/Molecules/Menus/UtilitiesPageContextMenu'
import TimerPage from './TimerPage'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Utilities' />
      <PageHeader text='Timer'>
        <UtilitiesPageContextMenu />
      </PageHeader>
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <TimerPage />
        </Suspense>
      </Box>
    </>
  )
}

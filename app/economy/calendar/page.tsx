import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
import { Suspense } from 'react'
import EconCalendarPage from './EconCalendarPage'

export default async function RecipesPage() {
  return (
    <>
      <PageHeader text={'Economic Calendar'}>
        <EconomyPageContextMenu />
      </PageHeader>
      <Suspense fallback={<ComponentLoader />}>
        <Box>
          <EconCalendarPage />
        </Box>
      </Suspense>
    </>
  )
}

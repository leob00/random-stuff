import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
import EconDataLayout from 'components/Organizms/econ/EconDataLayout'
import { Suspense } from 'react'

export default async function RecipesPage() {
  return (
    <>
      <PageHeader text={'Economic Indicators'}>
        <EconomyPageContextMenu />
      </PageHeader>
      <Suspense fallback={<ComponentLoader />}>
        <Box>
          <EconDataLayout />
        </Box>
      </Suspense>
    </>
  )
}

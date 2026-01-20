import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
import EconDataLayout from 'components/Organizms/econ/EconDataLayout'

export default async function RecipesPage() {
  return (
    <>
      <PageHeader text={'Economic Indicators'}>
        <EconomyPageContextMenu />
      </PageHeader>

      <Box>
        <EconDataLayout />
      </Box>
    </>
  )
}

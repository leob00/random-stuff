import { Box } from '@mui/material'
import AdvancedSearchDisplay from 'components/Organizms/stocks/advanced-search/AdvancedSearchDisplay'
import IndustriesLayout from './IndustriesLayout'

export default async function IndustriesPage() {
  return (
    <Box py={2}>
      <IndustriesLayout />
    </Box>
  )
}

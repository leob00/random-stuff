'use client'
import { Box } from '@mui/material'
import EconDataTable from 'components/Organizms/econ/EconDataTable'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'

const StockIndicesDisplay = ({ data }: { data: EconomicDataItem[] }) => {
  return (
    <Box>
      <EconDataTable data={data} />
    </Box>
  )
}

export default StockIndicesDisplay

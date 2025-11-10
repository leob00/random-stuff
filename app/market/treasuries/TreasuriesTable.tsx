'use client'

import { Box } from '@mui/material'
import EconDataTable from 'components/Organizms/econ/EconDataTable'
import dayjs from 'dayjs'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { useRouter } from 'next/navigation'

const TreasuriesTable = ({ data }: { data: EconomicDataItem[] }) => {
  const router = useRouter()
  const handleItemClicked = (item: EconomicDataItem) => {
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(10, 'years').year()
    router.push(`/csr/economic-indicators/${item.InternalId}?startYear=${startYear}&endYear=${endYear}&ret=${encodeURIComponent('/market/treasuries')}`)
  }
  return (
    <Box>
      <EconDataTable data={data} handleItemClicked={handleItemClicked} />
    </Box>
  )
}

export default TreasuriesTable

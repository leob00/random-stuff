import { Box } from '@mui/material'
import { EconDataModel } from 'components/Organizms/econ/EconDataLayout'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { stockIndices } from 'lib/backend/markets/economicIndicators'
import StockIndicesDisplay from './StockIndicesDisplay'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/EconReports`
  const resp = await get(url)
  const dbResult = resp as EconDataModel
  const econData = dbResult.Body.Items
  const result: EconomicDataItem[] = []
  stockIndices.forEach((id) => {
    const item = econData.find((m) => m.InternalId === id)
    if (item) {
      result.push({ ...item })
    }
  })

  return result
}

export default async function StockIndicesPage() {
  const data = await getData()
  return (
    <Box>
      <Box>
        <StockIndicesDisplay data={data ?? []} />
      </Box>
    </Box>
  )
}

import { Box } from '@mui/material'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'
import { apiConnection } from 'lib/backend/api/config'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'

export const revalidate = 600 // revalidate every 10 minutes
const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/Futures`
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ApiKey: String(config.key),
    },
  })
  const result = (await resp.json()) as QlnApiResponse
  const quotes = result.Body as StockQuote[]
  return quotes
}

export default async function CommoditiesPage() {
  const data = await getData()
  return (
    <Box>
      <Box>{data && <CommoditiesLayout data={data} />}</Box>
    </Box>
  )
}

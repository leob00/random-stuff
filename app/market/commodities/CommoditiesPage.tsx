import { Box } from '@mui/material'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/Futures`
  const resp = await get(url)
  const quotes = resp.Body as StockQuote[]
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

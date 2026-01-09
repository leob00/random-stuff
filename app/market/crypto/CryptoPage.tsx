import { Box } from '@mui/material'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/Crypto`
  const resp = await get(url)
  const quotes = resp.Body as StockQuote[]
  return quotes
}

export default async function CryptoPage() {
  const data = await getData()
  return (
    <Box>
      <Box>{data && <CryptosDisplay data={data} userProfile={null} />}</Box>
    </Box>
  )
}

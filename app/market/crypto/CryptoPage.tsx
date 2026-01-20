import { Box } from '@mui/material'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/Crypto`
  const resp = await fetch(url, {
    next: { revalidate: 1800 }, // Revalidate every 30 minutes
    headers: {
      'Content-Type': 'application/json',
      ApiKey: String(config.key),
    },
  })
  const result = (await resp.json()) as QlnApiResponse
  const quotes = result.Body as StockQuote[]
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

import { Box } from '@mui/material'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import { StockQuote } from 'lib/backend/api/models/zModels'

export default async function CryptoPage({ data }: { data: StockQuote[] }) {
  return (
    <Box>
      <Box>{data && <CryptosDisplay data={data} userProfile={null} />}</Box>
    </Box>
  )
}

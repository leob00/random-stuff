import { Box } from '@mui/material'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import StockMarketSummaryDisplay from 'components/Organizms/stocks/summary/StockMarketSummaryDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake, MarketHandshakeSchema } from 'lib/backend/api/models/zModels'
import { ZodError } from 'zod'

const config = apiConnection().qln

type Model = {
  handshake?: MarketHandshake
  error?: unknown
}

const getData = async () => {
  const result: Model = {}

  try {
    const apiUrl = `${config.url}/MarketHandshake`
    const resp = await get(apiUrl)
    result.handshake = MarketHandshakeSchema.parse(resp.Body)
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('Validation failed:', err.issues)
      result.error = err.message
      // You can access granular error details in error.issues
    } else {
      console.error('An unexpected error occurred:', err)
    }
  }
  return result
}
export default async function StockMarketSummaryPage() {
  const data = await getData()
  return (
    <Box>
      {data.error !== undefined && (
        <Box>
          <ErrorMessage text='An error has ocurred. Please refresh the page.' />
        </Box>
      )}
      {data && data.handshake && !data.error && (
        <Box>
          <StockMarketSummaryDisplay data={data.handshake} />
        </Box>
      )}
    </Box>
  )
}

import { Box } from '@mui/material'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import StockMarketSummaryDisplay from 'components/Organizms/stocks/summary/StockMarketSummaryDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'

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
    result.handshake = resp.Body as MarketHandshake
  } catch (err) {
    result.error = err
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

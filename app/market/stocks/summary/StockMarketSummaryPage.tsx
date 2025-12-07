import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import StockMarketSummaryDisplay from 'components/Organizms/stocks/summary/StockMarketSummaryDisplay'
import Countdown from 'components/Organizms/time/Countdown'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'

const config = apiConnection().qln
const getData = async () => {
  const apiUrl = `${config.url}/MarketHandshake`
  const resp = await get(apiUrl)
  return resp.Body as MarketHandshake
}
export default async function StockMarketSummaryPage() {
  const data = await getData()
  return (
    <Box>
      {data && (
        <Box>
          <StockMarketSummaryDisplay data={data} />
        </Box>
      )}
    </Box>
  )
}

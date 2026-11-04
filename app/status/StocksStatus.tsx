import { Box } from '@mui/material'
import { getStockQuotesServer } from 'lib/backend/api/qln/qlnApi'
import { StatusResponse } from './statusResponse'
import StatusCard from './StatusCard'
import { sleep } from 'lib/util/timers'

export default async function StocksStatus() {
  await sleep(1000)
  const stocksResponse = await getStockQuotesServer(['MSFT', 'NVDA'])
  const data: StatusResponse = {
    success: stocksResponse.length === 2,
  }

  return (
    <Box py={1}>
      <StatusCard title='Stocks' data={data} />
    </Box>
  )
}

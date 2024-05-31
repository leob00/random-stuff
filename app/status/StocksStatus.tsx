import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { StatusResponse } from './statusResponse'
import StatusCard from './StatusCard'

async function getData() {
  await sleep(1000)
  const resp = await getLatestQuotes(['MSFT', 'NVDA'])

  const result: StatusResponse = {
    success: resp.length === 2,
  }
  return result
}
export default async function StocksStatus() {
  const data = await getData()
  return (
    <Box py={1}>
      <StatusCard title='Stocks' data={data} />
    </Box>
  )
}

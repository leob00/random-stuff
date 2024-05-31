import { Box } from '@mui/material'
import { getNewsBySource } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { StatusResponse } from './statusResponse'
import StatusCard from './StatusCard'

async function getData() {
  await sleep(3000)
  const resp = await getNewsBySource('GoogleTopStories')
  const result: StatusResponse = {
    success: resp.length > 0,
  }
  return result
}
export default async function NewsStatus() {
  const data = await getData()
  return (
    <Box py={1}>
      <StatusCard title='News' data={data} />
    </Box>
  )
}

import { Box } from '@mui/material'
import { getNewsBySource } from 'lib/backend/api/qln/qlnApi'
import { StatusResponse } from './statusResponse'
import StatusCard from './StatusCard'
import { sleep } from 'lib/util/timers'

export default async function NewsStatus() {
  await sleep(2000)
  const newsResponse = await getNewsBySource('GoogleTopStories')
  const data: StatusResponse = {
    success: newsResponse.length > 0,
  }

  return (
    <Box py={1}>
      <StatusCard title='News' data={data} />
    </Box>
  )
}

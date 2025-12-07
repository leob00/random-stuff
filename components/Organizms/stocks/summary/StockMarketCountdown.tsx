import { Box } from '@mui/material'
import Countdown from 'components/Organizms/time/Countdown'
import dayjs from 'dayjs'
import { usePolling } from 'hooks/usePolling'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import { convertUtcToUsEasternDateTime, getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { useEffect, useState } from 'react'

const StockMarketCountdown = ({ data }: { data: MarketHandshake }) => {
  const [current, setCurrent] = useState(getCurrentDateTimeUsEastern())
  let startDt = data.StockLatestTradeDateTimeEst
  let endDt = data.NextOpenDateTime
  if (data.IsOpen) {
    startDt = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).add(9, 'hours').add(30, 'minutes').format()
    const dt = dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')
    endDt = dayjs(dt).add(16, 'hours').format()
  }
  const { pollCounter } = usePolling(1000)
  useEffect(() => {
    setCurrent(getCurrentDateTimeUsEastern())
  }, [pollCounter])

  return (
    <Box display={'flex'} justifyContent={'flex-start'}>
      <Countdown start={startDt} current={current} end={endDt} title={`${data.IsOpen ? 'countdown to close' : 'countdown to open'}`} />
    </Box>
  )
}
export default StockMarketCountdown

import { Box } from '@mui/material'
import Countdown from 'components/Organizms/time/Countdown'
import dayjs from 'dayjs'
import { usePolling } from 'hooks/usePolling'
import { MarketHandshake } from 'lib/backend/api/models/zModels'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { useEffect, useState } from 'react'

const StockMarketCountdown = ({ data }: { data: MarketHandshake }) => {
  const [current, setCurrent] = useState(getCurrentDateTimeUsEastern())
  let startDt = data.StockLatestTradeDateTimeEst
  const currentDtNoTime = dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')
  const lastDradeDtNoTime = dayjs(data.StockLatestTradeDateTimeEst).format('YYYY-MM-DD')
  let endDt = data.NextOpenDateTime
  if (data.IsOpen) {
    startDt = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).add(9, 'hours').add(30, 'minutes').format()
    endDt = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).add(16, 'hours').format()
  } else {
    const isLastTradingDateToday = lastDradeDtNoTime == currentDtNoTime
    if (isLastTradingDateToday) {
      startDt = dayjs(startDt).set('hours', 16).set('minutes', 0).format()
    }
  }
  const { pollCounter } = usePolling(1000)
  useEffect(() => {
    setCurrent(getCurrentDateTimeUsEastern())
  }, [pollCounter])

  return (
    <Box display={'flex'}>
      <Countdown start={startDt} current={current} end={endDt} title={`${data.IsOpen ? 'countdown to close' : 'countdown to open'}`} />
    </Box>
  )
}
export default StockMarketCountdown

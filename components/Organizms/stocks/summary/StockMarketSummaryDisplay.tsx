'use client'
import { Box, useTheme } from '@mui/material'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { usePolling } from 'hooks/usePolling'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import { useEffect, useState } from 'react'
import StockMarketCountdown from './StockMarketCountdown'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import dayjs from 'dayjs'
import PreMarketSummary from './PreMarketSummary'
import MidMarketSummary from './MidMarketSummary'
const getData = async () => {
  const resp = await serverGetFetch('/MarketHandshake')
  return resp.Body as MarketHandshake
}

const StockMarketSummaryDisplay = ({ data }: { data: MarketHandshake }) => {
  const theme = useTheme()

  const [handshake, setHandchake] = useState(data)
  const pollingSeconds = 1000 * 30 // 30 seconds
  const { pollCounter } = usePolling(pollingSeconds)

  const currentDt = dayjs(handshake.CurrentDateTimeEst)
  const nexOpenDt = dayjs(handshake.NextOpenDateTime)

  const currenDtNoTime = dayjs(currentDt).format('YYYY-MM-DD')
  const nextOpenDtNoTime = dayjs(nexOpenDt).format('YYYY-MM-DD')
  const isTradingDay = currenDtNoTime === nextOpenDtNoTime
  const showPremarket = isTradingDay && currentDt.hour() >= 6 && currentDt.hour() <= 10
  const showMidMarket = isTradingDay && currentDt.hour() >= 11 && currentDt.hour() <= 16 && currentDt.minute() > -15
  const showMPostMarketDay = isTradingDay && currentDt.hour() >= 16 && currentDt.minute() > 30

  useEffect(() => {
    const fn = async () => {
      const result = await getData()
      setHandchake(result)
    }
    fn()
  }, [pollCounter])

  return (
    <Box minHeight={500}>
      <Box display={'flex'} gap={2} flexWrap={'wrap'}>
        <BorderedBox width={{ xs: 168, sm: 168, md: 164 }} height={210}>
          <Box>
            <ReadOnlyField
              variant='caption'
              label='status'
              val={`${handshake.IsOpen ? 'OPEN' : 'CLOSED'}`}
              color={`${handshake.IsOpen ? theme.palette.success.main : theme.palette.warning.main}`}
            />
          </Box>
          <Box display={'flex'}>
            <StockMarketCountdown data={handshake} />
          </Box>
        </BorderedBox>
        {/* <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'top left' }}> */}
        {showPremarket && <PreMarketSummary />}
        {showMidMarket && <MidMarketSummary />}
        {showMPostMarketDay && <MidMarketSummary />}
        {/* </Box> */}
      </Box>
    </Box>
  )
}

export default StockMarketSummaryDisplay

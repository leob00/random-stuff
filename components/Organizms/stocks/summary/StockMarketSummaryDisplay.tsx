'use client'
import { Box, Typography, useTheme } from '@mui/material'
import { usePolling } from 'hooks/usePolling'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import PreMarketSummary from './PreMarketSummary'
import MidMarketSummary from './MidMarketSummary'
import EveningSummary from './EveningSummary'
import HolidaySummary from './HolidaySummary'
import SunnyIcon from '@mui/icons-material/Sunny'
import BedtimeIcon from '@mui/icons-material/Bedtime'
import { CasinoBlueTransparent, GoldColor } from 'components/themes/mainTheme'
import StockMarketCountdownHorizontal from './StockMarketCountdownHorizontal'

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
  const latestTradingDate = dayjs(handshake.StockLatestTradeDateTimeEst)
  const latestTradingDateNoTime = dayjs(latestTradingDate).format('YYYY-MM-DD')

  const currenDtNoTime = dayjs(currentDt).format('YYYY-MM-DD')
  const nextOpenDtNoTime = dayjs(nexOpenDt).format('YYYY-MM-DD')
  const isTradingDay = handshake.IsTradingDay
  const showPremarket = isTradingDay && currentDt.hour() >= 6 && currentDt.hour() <= 10
  const showMidMarket = !showPremarket && handshake.IsOpen
  const showMPostMarketDay = isTradingDay && !handshake.IsOpen && !showMidMarket && !showPremarket
  const showHoliday = !isTradingDay
  let message = handshake.Message
  if (!message) {
    if (handshake.IsOpen) {
      if (showMidMarket) {
        message = ``
      } else if (showPremarket) {
        message = 'Good morning!'
      }
    } else {
      if (showPremarket) {
        message = 'Good morning!'
      }
    }
  }

  useEffect(() => {
    const fn = async () => {
      const result = await getData()
      setHandchake(result)
    }
    fn()
  }, [pollCounter])

  return (
    <Box minHeight={800}>
      {/* {showPremarket && (
        <Box display={'flex'} justifyContent={'center'} pb={3} alignItems={'center'} gap={2}>
          <WbTwilightIcon fontSize='large' sx={{ color: GoldColor }} />
          <Typography color={GoldColor}>good morning!</Typography>
        </Box>
      )}
      {showMidMarket && (
        <Box display={'flex'} justifyContent={'center'} pb={4} alignItems={'center'} gap={2}>
          <SunnyIcon fontSize='large' sx={{ color: GoldColor }} />
          <Typography color={GoldColor}>stock exchanges are open</Typography>
        </Box>
      )}
      {showMPostMarketDay && (
        <Box display={'flex'} justifyContent={'center'} pb={3} alignItems={'center'} gap={2}>
          <BedtimeIcon fontSize='large' sx={{ color: CasinoBlueTransparent }} />
          <Typography>{`stock exchanges are closeed`}</Typography>
        </Box>
      )} */}
      <Box display={'flex'} justifyContent={'center'}>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          {handshake.IsOpen && (
            <Box display={'flex'} gap={1} alignItems={'flex-end'}>
              <SunnyIcon fontSize='medium' sx={{ color: GoldColor }} />
              <Typography variant='body2' color={GoldColor}>{`U.S stock exchanges are open`}</Typography>
            </Box>
          )}
          {!handshake.IsOpen && (
            <Box display={'flex'} gap={1} alignItems={'flex-end'}>
              <BedtimeIcon fontSize='medium' sx={{ color: CasinoBlueTransparent }} />
              <Typography variant='body2' color={CasinoBlueTransparent}>{`U.S stock exchanges are closed`}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} pb={2}>
        <StockMarketCountdownHorizontal data={handshake} />
      </Box>

      <Box display={'flex'} gap={1} flexWrap={{ xs: 'wrap', sm: 'unset' }}>
        {/* <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'top left' }}> */}
        {showPremarket && <PreMarketSummary />}
        {showMidMarket && <MidMarketSummary />}
        {showMPostMarketDay && <EveningSummary />}
        {showHoliday && (
          <Box>
            <HolidaySummary nextOpenDt={nextOpenDtNoTime} />
          </Box>
        )}
        {/* </Box> */}
      </Box>
    </Box>
  )
}

export default StockMarketSummaryDisplay

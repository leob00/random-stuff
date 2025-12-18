'use client'
import { Box, Typography, useTheme } from '@mui/material'
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
import EveningSummary from './EveningSummary'
import HolidaySummary from './HolidaySummary'
import SunnyIcon from '@mui/icons-material/Sunny'
import BedtimeIcon from '@mui/icons-material/Bedtime'
import { CasinoBlueTransparent, CasinoOrange, CasinoOrangeTransparent, CasinoYellowTransparent, GoldColor } from 'components/themes/mainTheme'

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
      {showPremarket && (
        <Box display={'flex'} justifyContent={'center'} pb={3} alignItems={'center'} gap={2}>
          <SunnyIcon fontSize='large' sx={{ color: GoldColor }} />
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
      )}
      <Box display={'flex'} gap={1} flexWrap={{ xs: 'wrap', sm: 'unset' }}>
        <BorderedBox height={260}>
          <Box display={'flex'} justifyContent={'flex-start'} pb={2}>
            {showMidMarket && <SunnyIcon fontSize='small' sx={{ color: GoldColor }} />}
            {showMPostMarketDay && <BedtimeIcon fontSize='small' sx={{ color: CasinoBlueTransparent }} />}
          </Box>
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

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
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

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

  const nextOpenDtNoTime = dayjs(nexOpenDt).format('YYYY-MM-DD')
  const currentDtNoTime = dayjs(currentDt).format('YYYY-MM-DD')
  const morningStart = dayjs(currentDtNoTime).add(6, 'hours')
  const morningEnd = dayjs(currentDtNoTime).add(10, 'hours').add(15, 'minutes')

  const isTradingDay = handshake.IsTradingDay
  const showMorning = isTradingDay && currentDt.isSameOrAfter(morningStart) && currentDt.isSameOrBefore(morningEnd)
  const showMidMarket = !showMorning && handshake.IsOpen
  const showMPostMarketDay = isTradingDay && !handshake.IsOpen && !showMidMarket && !showMorning
  const showHoliday = !isTradingDay

  useEffect(() => {
    const fn = async () => {
      const result = await getData()
      setHandchake(result)
    }
    fn()
  }, [pollCounter])

  return (
    <Box minHeight={1000}>
      <Box display={'flex'} justifyContent={'center'}>
        <BorderedBox mb={2} mt={-2} width={{ xs: '100%', sm: '80%', lg: '30%' }} justifyContent={'center'}>
          <Box display={'flex'} justifyContent={'center'}>
            <Box display={'flex'} gap={2} alignItems={'center'}>
              {handshake.IsOpen && (
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <SunnyIcon fontSize='medium' sx={{ color: GoldColor }} />
                  <Typography variant='body2' color={GoldColor}>{`U.S markets are open`}</Typography>
                </Box>
              )}
              {!handshake.IsOpen && (
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <BedtimeIcon fontSize='medium' sx={{ color: CasinoBlueTransparent }} />
                  {!showHoliday ? (
                    <Typography variant='body2' color={CasinoBlueTransparent}>{`U.S markets are closed`}</Typography>
                  ) : (
                    <>
                      {data.HolidayName ? (
                        <Typography variant='body2' color={CasinoBlueTransparent}>{`U.S markets are closed for ${handshake.HolidayName}`}</Typography>
                      ) : (
                        <Typography variant='body2' color={CasinoBlueTransparent}>{`U.S markets are closed`}</Typography>
                      )}
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'center'}>
            <StockMarketCountdownHorizontal data={handshake} />
          </Box>
        </BorderedBox>
      </Box>
      <Box display={'flex'} justifyContent={'center'} gap={1} flexWrap={{ xs: 'wrap', sm: 'unset' }}>
        {/* <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'top left' }}> */}
        {showMorning && <PreMarketSummary />}
        {showMidMarket && <MidMarketSummary />}
        {showMPostMarketDay && <EveningSummary />}
        {showHoliday && <HolidaySummary nextOpenDt={nextOpenDtNoTime} />}
        {/* </Box> */}
      </Box>
    </Box>
  )
}

export default StockMarketSummaryDisplay

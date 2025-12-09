'use client'
import { Box, Typography, useTheme } from '@mui/material'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { usePolling } from 'hooks/usePolling'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import { useEffect, useState } from 'react'
import StockMarketCountdown from './StockMarketCountdown'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import CenterStack from 'components/Atoms/CenterStack'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import PreMarketSummary from './PreMarketSummary'
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

  useEffect(() => {
    const fn = async () => {
      const result = await getData()
      setHandchake(result)
    }
    fn()
  }, [pollCounter])

  return (
    <Box>
      <Box display={'flex'} gap={2} flexWrap={'wrap'}>
        <BorderedBox width={{ xs: '40%', sm: '30%', md: '20%', lg: '14%' }}>
          <Box>
            <ReadOnlyField
              variant='caption'
              label='status'
              val={`${handshake.IsOpen ? 'OPEN' : 'CLOSED'}`}
              color={`${handshake.IsOpen ? theme.palette.success.main : theme.palette.warning.main}`}
            />
          </Box>
          <Box>
            <StockMarketCountdown data={handshake} />
          </Box>
        </BorderedBox>
        <BorderedBox flexGrow={1}>
          <>{showPremarket && <PreMarketSummary />}</>
        </BorderedBox>
      </Box>
    </Box>
  )
}

export default StockMarketSummaryDisplay

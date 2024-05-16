import { Box, Paper, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'
import StockMarketStatsChart from './charts/StockMarketStatsChart'
import StockMarketStatus from './StockMarketStatus'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'

const StockMarketGlance = () => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/MarketHandshake?loadSentiment=true`
  const dataFn = async () => {
    const resp = await get(apiUrl)
    return resp.Body as MarketHandshake
  }
  const { data } = useSwrHelper<MarketHandshake>(apiUrl, dataFn)
  return (
    <Box>
      <Box py={2}>
        <CenteredHeader title={'stock market sentiment'} />
        {data ? (
          <>
            <StockMarketStatsChart data={data.StockStats} />
            <Box pt={2}>
              <StockMarketStatus data={data} />
            </Box>
            <CenterStack sx={{ my: 2 }}>
              <Typography variant='caption' sx={{ fontSize: 10 }}>{`data as of: ${dayjs(data.StockStats.DateModified).format('MM/DD/YYYY hh:mm A')} (ET)`}</Typography>
            </CenterStack>
            <CenterStack>
              <SiteLink text='sentiment report' href={'/csr/stocks/sentiment'} />
            </CenterStack>
            <Box py={2}>
              <HorizontalDivider />
            </Box>
          </>
        ) : (
          <>
            <CircleLoader />
            <StockMarketStatsChart
              data={{
                MarketDate: '',
                TotalDown: 0,
                TotalDownPercent: 48,
                TotalUnchanged: 0,
                TotalUnchangedPercent: 6,
                TotalUp: 0,
                TotalUpPercent: 48,
                DateModified: '',
              }}
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default StockMarketGlance

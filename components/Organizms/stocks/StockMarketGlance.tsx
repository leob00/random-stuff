import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
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
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const StockMarketGlance = () => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/MarketHandshake?loadSentiment=true`
  const dataFn = async () => {
    const resp = await get(apiUrl)
    return resp.Body as MarketHandshake
  }
  const { data, isLoading } = useSwrHelper<MarketHandshake>(apiUrl, dataFn)
  return (
    <Box>
      <Box py={2}>
        <CenteredHeader title={'stock market sentiment'} />
        {isLoading && <BackdropLoader />}
        {data ? (
          <>
            <StockMarketStatsChart data={data.StockStats} />
            <Box pt={2}>
              <StockMarketStatus data={data} />
            </Box>
            <CenterStack sx={{ my: 2 }}>
              <Typography
                variant='caption'
                sx={{ fontSize: 10 }}
              >{`data as of: ${dayjs(data.StockStats.DateModified).format('MM/DD/YYYY hh:mm A')} (ET)`}</Typography>
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
            <StockMarketStatsChart
              data={{
                DateModified: '',
                TotalDown: 0,
                TotalUp: 0,
                TotalUnchanged: 0,
                TotalDownPercent: 0,
                TotalUpPercent: 0,
                TotalUnchangedPercent: 100,
                MarketDate: '',
              }}
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default StockMarketGlance

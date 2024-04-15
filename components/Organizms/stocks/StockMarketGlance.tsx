import { Box, Paper, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'
import StockMarketStatsChart from './StockMarketStatsChart'
import StockMarketStatus from './StockMarketStatus'

const StockMarketGlance = () => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/MarketHandshake?loadSentiment=true`
  const dataFn = async () => {
    const resp = await get(apiUrl)
    return resp.Body as MarketHandshake
  }
  const { data } = useSwrHelper<MarketHandshake>(apiUrl, dataFn)
  return (
    <Paper elevation={4}>
      <Box py={2}>
        <CenteredTitle title={'Stock market at a glance'} />
        {data && (
          <>
            <CenterStack sx={{ pt: 1 }}>
              <Typography variant='caption'>{`data as of: ${dayjs(data.StockStats.DateModified).format('MM/DD/YYYY hh:mm A')} (ET)`}</Typography>
            </CenterStack>
            <StockMarketStatsChart data={data} />
            <StockMarketStatus data={data} />
          </>
        )}
      </Box>
    </Paper>
  )
}

export default StockMarketGlance

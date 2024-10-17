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
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'

const StockMarketGlance = ({
  showTitle = true,
  componentLoader = false,
  revalidateOnFocus = false,
}: {
  showTitle?: boolean
  componentLoader?: boolean
  revalidateOnFocus?: boolean
}) => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/MarketHandshake?loadSentiment=true`
  const dataFn = async () => {
    const resp = await get(apiUrl)
    return resp.Body as MarketHandshake
  }
  const { data, isLoading } = useSwrHelper<MarketHandshake>(apiUrl, dataFn, { revalidateOnFocus: revalidateOnFocus })
  return (
    <Box>
      <Box pt={2}>
        {showTitle && <CenteredHeader variant='h4' title={'Stock Market Sentiment'} />}
        {isLoading && <>{componentLoader ? <CircleLoader /> : <BackdropLoader />}</>}

        {data ? (
          <Box>
            <CenterStack sx={{ mt: -2 }}>
              <Typography variant='body2'>{`${dayjs(data.StockStats.DateModified).format('MM/DD/YYYY hh:mm A')} EST`}</Typography>
            </CenterStack>
            <StockMarketStatsChart data={data.StockStats} />
            <Box>
              <StockMarketStatus data={data} />
            </Box>

            <CenterStack>
              <SiteLink text='sentiment report' href={'/csr/stocks/sentiment'} />
            </CenterStack>
          </Box>
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

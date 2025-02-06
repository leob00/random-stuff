import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'

import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import StockMarketStatsChart from 'components/Organizms/stocks/charts/StockMarketStatsChart'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const StockMarketGlanceWidget = ({
  showTitle = true,
  componentLoader = false,
  revalidateOnFocus = false,
  width = 300,
  height = 600,
}: {
  showTitle?: boolean
  componentLoader?: boolean
  revalidateOnFocus?: boolean
  width?: number
  height?: number
}) => {
  const config = apiConnection().qln
  const apiUrl = `${config.url}/MarketHandshake?loadSentiment=true`
  const dataFn = async () => {
    const resp = await get(apiUrl)
    return resp.Body as MarketHandshake
  }
  const { data, isLoading } = useSwrHelper<MarketHandshake>(apiUrl, dataFn, { revalidateOnFocus: revalidateOnFocus })

  return (
    <Box maxWidth={width} height={height}>
      {showTitle && <CenteredHeader variant='h4' title={'Stock Market Sentiment'} />}
      {isLoading && <>{componentLoader ? <CircleLoader /> : <BackdropLoader />}</>}
      {data && (
        <Box>
          <Box display={'flex'} justifyContent={'center'}>
            <Typography textAlign={'center'} variant='caption'>{`${dayjs(data.StockStats.DateModified).format('MM/DD/YYYY hh:mm A')} EST`}</Typography>
          </Box>
          <Box>
            <StockMarketStatsChart data={data.StockStats} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default StockMarketGlanceWidget

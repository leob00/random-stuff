import { Box, Typography } from '@mui/material'
import { searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SentimentHistoryCharts from 'components/Organizms/stocks/charts/SentimentHistoryCharts'
import StockMarketStatsChart from 'components/Organizms/stocks/charts/StockMarketStatsChart'
import { getSentiment } from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import dayjs from 'dayjs'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/models/zModels'
import { sortArray } from 'lib/util/collections'

const key: CategoryType = 'stock-reports[daily-sentiment]'
export type StockSentimentDisplayModel = {
  lastRecord: StockStats | null
  history: StockStats[]
}

const getData = async () => {
  const resp = await searchItems(key)
  const result: StockStats[] = resp.map((item) => JSON.parse(item.data) as StockStats)

  const sorted = sortArray(result, ['MarketDate'], ['desc'])
  const history = sortArray(sorted, ['MarketDate'], ['asc'])
  const model: StockSentimentDisplayModel = {
    history: history,
    lastRecord: sorted ? sorted[0] : null,
  }
  return model
}

export default async function StockSentimentPage() {
  const data = await getData()
  return (
    <Box>
      {data.history && (
        <Box>
          {data.lastRecord && (
            <>
              <Typography textAlign={'center'}>{dayjs(data.lastRecord.MarketDate).format('MM/DD/YYYY')}</Typography>
              <Box mt={-4}>
                <StockMarketStatsChart data={data.lastRecord} />
              </Box>
            </>
          )}
          <SentimentHistoryCharts data={data.history} />
          <HorizontalDivider />
          <Typography pt={4} textAlign={'center'} variant='h5'>{`Aggregates`}</Typography>
          <Box pt={4} display={'flex'} justifyContent={'center'}>
            <Box display={'flex'} flexDirection={'row'} gap={{ xs: 4, sm: 1 }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }}>
              <Box>
                <StockMarketStatsChart title={`${data.history.length} Days`} data={getSentiment(data.history, data.history.length)} />
              </Box>
              <Box>
                <StockMarketStatsChart title={`${1} Month`} data={getSentiment(data.history, 30)} />
              </Box>
              <Box>
                <StockMarketStatsChart title={`2 Weeks`} data={getSentiment(data.history, 14)} />
              </Box>
              <Box>
                <StockMarketStatsChart title={`${1} Week`} data={getSentiment(data.history, 7)} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

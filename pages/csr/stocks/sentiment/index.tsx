import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import DailySentimentBarChart from 'components/Organizms/stocks/charts/DailySentimentBarChart'
import StockMarketStatsChart from 'components/Organizms/stocks/charts/StockMarketStatsChart'
import StockSentimentDisplay, { getSentiment } from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getDynamoItemData, searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import { take } from 'lodash'

const Page = () => {
  const key: CategoryType = 'stock-reports[daily-sentiment]'
  const dataFn = async () => {
    const resp = await searchDynamoItemsByCategory(key)
    const result: StockStats[] = resp.map((item) => JSON.parse(item.data) as StockStats)

    const sorted = sortArray(result, ['MarketDate'], ['desc'])
    const agg = await getDynamoItemData<StockStats[]>('stocks-monthly-market-sentiment')
    const model = {
      history: sortArray(sorted, ['MarketDate'], ['asc']),
      aggregates: agg,
    }
    return model
  }
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: false, revalidateOnMount: true })
  const lastRecord = data ? data.history[data.history.length - 1] : null
  return (
    <>
      <Seo pageTitle='Stock Sentiment' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Market Sentiment' />
        {data && data.history && (
          <Box>
            {lastRecord && (
              <>
                <Typography textAlign={'center'}>{dayjs(lastRecord.MarketDate).format('MM/DD/YYYY')}</Typography>
                <Box mt={-4}>
                  <StockMarketStatsChart data={lastRecord} />
                </Box>
              </>
            )}
            <DailySentimentBarChart data={data.history} />
            <Box pt={4}>
              <HorizontalDivider />
              <CenteredHeader title={`${data.history.length} Days`} variant='h5' />
              <Box mt={-4}>
                <StockMarketStatsChart data={getSentiment(data.history, data.history.length)} />
              </Box>
            </Box>
          </Box>
        )}
        <Box pt={4}>{data && data.aggregates && <StockSentimentDisplay data={data.aggregates} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page

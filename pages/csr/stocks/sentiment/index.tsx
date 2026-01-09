import { Box, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import Seo from 'components/Organizms/Seo'
import SentimentHistoryCharts from 'components/Organizms/stocks/charts/SentimentHistoryCharts'
import StockMarketStatsChart from 'components/Organizms/stocks/charts/StockMarketStatsChart'
import { getSentiment } from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/models/zModels'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'

const Page = () => {
  const key: CategoryType = 'stock-reports[daily-sentiment]'
  const dataFn = async () => {
    const resp = await searchDynamoItemsByCategory(key)
    const result: StockStats[] = resp.map((item) => JSON.parse(item.data) as StockStats)

    const sorted = sortArray(result, ['MarketDate'], ['desc'])
    const model = {
      history: sortArray(sorted, ['MarketDate'], ['asc']),
    }
    return model
  }
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: false, revalidateOnMount: true })
  const lastRecord = data ? data.history[data.history.length - 1] : null

  return (
    <>
      <Seo pageTitle='Stock Sentiment' />

      <ResponsiveContainer>
        <PageHeader text='Stock Market Sentiment'>
          <StockMarketPageContextMenu />
        </PageHeader>
        {isLoading && <ComponentLoader />}
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
            <SentimentHistoryCharts data={data.history} />
            <HorizontalDivider />
            <Typography pt={4} textAlign={'center'} variant='h5'>{`Aggregates`}</Typography>
            <Box pt={4} display={'flex'} justifyContent={'center'}>
              <Box display={'flex'} flexDirection={'row'} gap={{ xs: 4, sm: 1 }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }}>
                <Box>
                  <FadeIn>
                    <StockMarketStatsChart title={`${data.history.length} Days`} data={getSentiment(data.history, data.history.length)} />
                  </FadeIn>
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
        {/* <Box pt={4}>{data && data.aggregates && <StockSentimentDisplay data={data.aggregates} />}</Box> */}
      </ResponsiveContainer>
    </>
  )
}

export default Page

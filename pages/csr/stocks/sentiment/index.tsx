import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import JsonPreview from 'components/Molecules/Forms/Files/JsonPreview'
import Seo from 'components/Organizms/Seo'
import DailySentimentBarChart from 'components/Organizms/stocks/charts/DailySentimentBarChart'
import StockSentimentDisplay from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import StockMarketGlance from 'components/Organizms/stocks/StockMarketGlance'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { CategoryType, DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getDynamoItemData, searchDynamoItemsByCategory, searchDynamoItemsDataByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import { take } from 'lodash'

const Page = () => {
  const key: CategoryType = 'stock-reports[daily-sentiment]'
  const dataFn = async () => {
    const resp = await searchDynamoItemsByCategory(key)
    const result: StockStats[] = resp.map((item) => JSON.parse(item.data) as StockStats)

    const sorted = take(sortArray(result, ['MarketDate'], ['desc']), 12)
    const agg = await getDynamoItemData<StockStats[]>('stocks-monthly-market-sentiment')
    const model = {
      history: sortArray(sorted, ['MarketDate'], ['asc']),
      aggregates: agg,
    }
    return model
  }
  const { data, isLoading } = useSwrHelper(key, dataFn)

  return (
    <>
      <Seo pageTitle='Stock Sentiment' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Market Sentiment' />
        {data && data.history && <DailySentimentBarChart data={data.history} />}
        {/* <Box display={'flex'} justifyContent={'center'} pb={4}>
          <StockMarketGlance showTitle={false} showFooter={false} />
        </Box> */}
        <Box pt={4}>{data && data.aggregates && <StockSentimentDisplay data={data.aggregates} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page

import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import DailySentimentBarChart from 'components/Organizms/stocks/charts/DailySentimentBarChart'
import StockSentimentDisplay from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
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
        <Box pt={4}>{data && data.aggregates && <StockSentimentDisplay data={data.aggregates} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page

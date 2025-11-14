import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuStockSentiment from 'components/Molecules/Menus/ContextMenuStockSentiment'
import Seo from 'components/Organizms/Seo'
import SentimentHistoryCharts from 'components/Organizms/stocks/charts/SentimentHistoryCharts'
import StockMarketStatsChart from 'components/Organizms/stocks/charts/StockMarketStatsChart'
import StockSentimentDisplay, { getSentiment } from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { CategoryType } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getDynamoItemData, searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuAllStocks />,
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuReport text={'reports'} />,
      fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/csr/stocks/earnings-calendar'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/csr/commodities'),
    },
    {
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/csr/crypto'),
    },
  ]
  return (
    <>
      <Seo pageTitle='Stock Sentiment' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Market Sentiment' />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
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
            <Box pt={4} display={'flex'} justifyContent={'center'}>
              <HorizontalDivider />
              <Box display={'flex'} flexDirection={'row'} gap={1} flexWrap={'wrap'} justifyContent={{ xs: 'center' }}>
                <Box>
                  <StockMarketStatsChart title={`${data.history.length} Days`} data={getSentiment(data.history, data.history.length)} />
                </Box>
                <Box>
                  <StockMarketStatsChart title={`${1} Week`} data={getSentiment(data.aggregates, 7)} />
                </Box>
                <Box>
                  <StockMarketStatsChart title={`${1} Month`} data={getSentiment(data.aggregates, 30)} />
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

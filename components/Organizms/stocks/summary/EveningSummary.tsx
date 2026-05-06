import { Box } from '@mui/material'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import CommoditiesSummary from './CommoditiesSummary'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { useSwrHelper } from 'hooks/useSwrHelper'
import dayjs from 'dayjs'
import { sleep } from 'lib/util/timers'
import EarningsSummary from './earnings/EarningsSummary'
import { usePolling } from 'hooks/usePolling'
import { useEffect } from 'react'
import { mutate } from 'swr'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import RecentlySearchedStocksSummary from './stocks/RecentlySearchedStocksSummary'
import TopMoversSummary from './stocks/TopMoversSummary'
import NewsSummary from './NewsSummary'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { filterResult } from '../earnings/earningsCalendar'
import CryptoSummary from './CryptoSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { orderBy } from 'lodash'
import { StockStats } from 'lib/backend/api/models/zModels'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import SentimentSummary from './stocks/SentimentSummary'
import { useRouter } from 'next/navigation'

type Model = {
  allEarnings: StockEarning[]
  dailySentiment: StockStats | null
}

const EveningSummary = () => {
  const router = useRouter()
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const mutateKey = 'stock-reported-earnings-all'
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 3000))
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    const today = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).format()
    let result = filterResult(mapped, today)
    const sentimentResp = await searchDynamoItemsByCategory('stock-reports[daily-sentiment]')
    const sentimentResults: StockStats[] = sentimentResp.map((item) => JSON.parse(item.data) as StockStats)

    const sortedSentiments = sortArray(sentimentResults, ['MarketDate'], ['desc'])
    const lastSentiment = sortedSentiments.length > 0 ? sortedSentiments[0] : null
    if (result.length === 0) {
      result = orderBy(
        mapped.filter((m) => dayjs(m.ReportDate).isAfter(dayjs(today))),
        ['ReportDate', 'StockQuote.MarketCap'],
        ['asc', 'desc'],
      )
    }
    const res: Model = {
      allEarnings: result,
      dailySentiment: lastSentiment,
    }
    return res
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { pollCounter } = usePolling(1000 * 240) // 4 minutes

  const handleRefresh = () => {
    mutate(mutateKey)
  }
  const onGoToPage = () => {
    router.push('/market/stocks/sentiment')
  }

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    if (pollCounter >= 1) {
      fn()
    }
  }, [pollCounter])

  return (
    <Box>
      {!isValidatingProfile && (
        <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={{ xs: 'center', md: 'unset' }}>
          <SentimentSummary data={data?.dailySentiment} onRefresh={handleRefresh} onGoToPage={onGoToPage} isLoading={isLoading} />
          <Box>
            <BorderedBox>
              <TopMoversSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox>
              <RecentlySearchedStocksSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox>
              <EarningsSummary
                userProfile={userProfile}
                data={data?.allEarnings}
                title='Scheduled Earnings'
                isLoading={isLoading || isValidatingProfile}
                onRefreshRequest={handleRefresh}
              />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox>
              <CommoditiesSummary />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox>
              <CryptoSummary />
            </BorderedBox>
          </Box>
          <Box maxWidth={{ xs: '100%', sm: '98%', md: '94%', lg: '68%' }}>
            <BorderedBox>
              <NewsSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EveningSummary

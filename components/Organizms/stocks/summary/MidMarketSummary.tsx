import { Box, Typography } from '@mui/material'
import TopMoversSummary from './stocks/TopMoversSummary'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { filterResult } from '../earnings/earningsCalendar'
import dayjs from 'dayjs'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { sleep } from 'lib/util/timers'
import EarningsSummary from './earnings/EarningsSummary'
import { usePolling } from 'hooks/usePolling'
import { useEffect } from 'react'
import { mutate } from 'swr'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import NewsSummary from './NewsSummary'
import RecentlySearchedStocksSummary from './stocks/RecentlySearchedStocksSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { orderBy } from 'lodash'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { StockStats } from 'lib/backend/api/models/zModels'
import { sortArray } from 'lib/util/collections'
import StockMarketStatsChart from '../charts/StockMarketStatsChart'
import SummaryTitle from './SummaryTitle'

type Model = {
  scheduledEarnings: StockEarning[]
  upcomingEarnings: StockEarning[]
  dailySentiment: StockStats | null
}

const MidMarketSummary = () => {
  const mutateKey = 'earnings-mid-market'
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const dataFn = async () => {
    const currentDtEst = getCurrentDateTimeUsEastern()
    await sleep(getRandomInteger(250, 600))
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    const today = dayjs(dayjs(currentDtEst).format('YYYY-MM-DD')).format()
    const todaysEarnings = filterResult(mapped, today)

    const upComingEarnings = orderBy(
      mapped.filter((m) => dayjs(m.ReportDate).isAfter(dayjs(today))),
      ['ReportDate', 'StockQuote.MarketCap'],
      ['asc', 'desc'],
    )
    const sentimentResp = await searchDynamoItemsByCategory('stock-reports[daily-sentiment]')
    const sentimentResults: StockStats[] = sentimentResp.map((item) => JSON.parse(item.data) as StockStats)

    const sortedSentiments = sortArray(sentimentResults, ['MarketDate'], ['desc'])
    const lastSentiment = sortedSentiments.length > 0 ? sortedSentiments[0] : null
    const result: Model = {
      scheduledEarnings: todaysEarnings,
      upcomingEarnings: upComingEarnings,
      dailySentiment: lastSentiment,
    }
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { pollCounter } = usePolling(1000 * getRandomInteger(240, 360)) // 4 - 6 minutes
  const handleRefresh = () => {
    mutate(mutateKey)
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
          <Box>
            <BorderedBox>
              <TopMoversSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox width={'100%'}>{!isValidatingProfile && <RecentlySearchedStocksSummary userProfile={userProfile} />}</BorderedBox>
          </Box>
          {data && data.scheduledEarnings && data.scheduledEarnings && data.scheduledEarnings.length > 0 && (
            <Box>
              <BorderedBox width={'100%'}>
                <EarningsSummary
                  userProfile={userProfile}
                  data={data?.scheduledEarnings}
                  title={`Today's Earnings`}
                  isLoading={isLoading || isValidatingProfile}
                  onRefreshRequest={handleRefresh}
                />
              </BorderedBox>
            </Box>
          )}

          <Box>
            <BorderedBox width={'100%'}>
              <EarningsSummary
                userProfile={userProfile}
                data={data?.upcomingEarnings}
                title={`Upcoming Earnings`}
                isLoading={isLoading || isValidatingProfile}
                onRefreshRequest={handleRefresh}
              />
            </BorderedBox>
          </Box>
          {data && data.dailySentiment && (
            <Box>
              <BorderedBox width={'100%'}>
                <Box height={513}>
                  <SummaryTitle title={`Daily Sentiment`} onRefresh={handleRefresh} />
                  <Typography variant='body2' textAlign={'center'}>{`${dayjs(data.dailySentiment.MarketDate).format('MM/DD/YYYY')}`}</Typography>
                  <StockMarketStatsChart data={data.dailySentiment} isLoading={isLoading || isValidatingProfile} />
                </Box>
              </BorderedBox>
            </Box>
          )}
          <Box maxWidth={{ xs: 348, sm: '98%', md: '94%', lg: '68%' }}>
            <BorderedBox width={'100%'}>
              <NewsSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default MidMarketSummary

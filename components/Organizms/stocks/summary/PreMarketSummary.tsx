import { Box } from '@mui/material'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import CommoditiesSummary from './CommoditiesSummary'
import { sleep } from 'lib/util/timers'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { filterResult } from '../earnings/earningsCalendar'
import dayjs from 'dayjs'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'
import EarningsSummary from './earnings/EarningsSummary'
import NewsSummary from './NewsSummary'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { usePolling } from 'hooks/usePolling'
import { useEffect } from 'react'
import { getRandomInteger } from 'lib/util/numberUtil'
import { mutate } from 'swr'
import CryptoSummary from './CryptoSummary'
import { sortArray } from 'lib/util/collections'

interface Model {
  upcomingEarnings: StockEarning[]
  reportedEarnings: StockEarning[]
}

const PreMarketSummary = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const mutateKey = 'earnings-pre-market'
  const dataFn = async () => {
    await sleep(getRandomInteger(500, 2500))
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    const today = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).format()
    const todaysEarnings = filterResult(mapped, today)
    const reportedEarnings = sortArray(
      earnings.filter((m) => m.ActualEarnings),
      ['ReportDate', 'StockQuote.MarketCap'],
      ['desc', 'desc'],
    )
    const model: Model = {
      upcomingEarnings: todaysEarnings,
      reportedEarnings,
    }
    return model
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { pollCounter } = usePolling(1000 * getRandomInteger(240, 360)) // 4-6 minutes

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])
  return (
    <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
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
      <Box>
        <BorderedBox>
          <EarningsSummary userProfile={userProfile} data={data?.upcomingEarnings} title='Upcoming Earnings' isLoading={isLoading || isValidatingProfile} />
        </BorderedBox>
      </Box>
      <Box>
        <BorderedBox>
          <EarningsSummary userProfile={userProfile} data={data?.reportedEarnings} title='Reported Earnings' isLoading={isLoading || isValidatingProfile} />
        </BorderedBox>
      </Box>
      <Box maxWidth={{ xs: 348, sm: '98%', md: '94%', lg: '68%' }}>
        <BorderedBox>
          <NewsSummary userProfile={userProfile} />
        </BorderedBox>
      </Box>
    </Box>
  )
}

export default PreMarketSummary

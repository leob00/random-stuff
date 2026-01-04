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
import { sortArray } from 'lib/util/collections'
import { filterResult } from '../earnings/earningsCalendar'
import CryptoSummary from './CryptoSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import NewsSummary from './NewsSummary'
import RecentlySearchedStocksSummary from './stocks/RecentlySearchedStocksSummary'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { getMapFromArray } from 'lib/util/collectionsNative'
dayjs.extend(isSameOrAfter)

interface Model {
  reportedEarnings: StockEarning[]
  upcomingEarnings: StockEarning[]
}

const HolidaySummary = ({ nextOpenDt }: { nextOpenDt: string }) => {
  const mutateKey = 'RecentEarnings'
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const dataFn = async () => {
    await sleep(getRandomInteger(1000, 2500))
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    let mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    mapped = sortArray(mapped, ['ReportDate', 'StockQuote.MarketCap'], ['asc', 'desc'])

    const recent = sortArray(
      mapped.filter((m) => m.ActualEarnings),
      ['ReportDate', 'StockQuote.MarketCap'],
      ['desc', 'desc'],
    )
    const upcoming = mapped.filter((m) => dayjs(m.ReportDate).isSameOrAfter(dayjs(nextOpenDt).format()))
    const result: Model = {
      reportedEarnings: recent,
      upcomingEarnings: upcoming,
    }
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const pollingInterval = 1000 * 360 // 6 minutes
  const { pollCounter } = usePolling(getRandomInteger(pollingInterval, pollingInterval + 10000))

  useEffect(() => {
    const fn = async () => {
      await sleep(getRandomInteger(250, 3000))
      mutate(mutateKey)
    }
    if (pollCounter >= 1) {
      fn()
    }
  }, [pollCounter])

  return (
    // <Box display={'flex'} sx={{ transform: 'scale(0.98)', transformOrigin: 'top left' }} width={'125%'}>
    <Box>
      {!isValidatingProfile && (
        <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
          <Box>
            <BorderedBox width={'100%'}>{!isValidatingProfile && <RecentlySearchedStocksSummary userProfile={userProfile} />}</BorderedBox>
          </Box>
          <Box>
            <BorderedBox width={'100%'}>
              <EarningsSummary userProfile={userProfile} data={data?.reportedEarnings} title='Reported Earnings' isLoading={isLoading || isValidatingProfile} />
            </BorderedBox>
          </Box>
          <Box>
            <BorderedBox width={'100%'}>
              <EarningsSummary userProfile={userProfile} data={data?.upcomingEarnings} title='Upcoming Earnings' isLoading={isLoading || isValidatingProfile} />
            </BorderedBox>
          </Box>

          <Box>
            <BorderedBox width={'100%'}>
              <CommoditiesSummary />
            </BorderedBox>
          </Box>

          <Box>
            <BorderedBox width={'100%'}>
              <CryptoSummary />
            </BorderedBox>
          </Box>
          <Box maxWidth={{ xs: '100%', sm: '98%', md: '94%', lg: '69%' }}>
            <BorderedBox width={'100%'}>
              <NewsSummary userProfile={userProfile} />
            </BorderedBox>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HolidaySummary

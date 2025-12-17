import { Box } from '@mui/material'
import TopMoversSummary from './stocks/TopMoversSummary'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import CommoditiesSummary from './CommoditiesSummary'
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

const MidMarketSummary = () => {
  const mutateKey = 'earnings-mid-market'
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const dataFn = async () => {
    await sleep(500)
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    const today = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).format()
    const result = filterResult(mapped, today)
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { pollCounter } = usePolling(1000 * getRandomInteger(240, 360)) // 4 - 6 minutes

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])

  return (
    <Box display={'flex'} gap={1} flexWrap={'wrap'}>
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
          <EarningsSummary userProfile={userProfile} data={data} title={`Scheduled Earnings`} isLoading={isLoading || isValidatingProfile} />
        </BorderedBox>
      </Box>
      {/* <Box>
        <BorderedBox>
          <CommoditiesSummary />
        </BorderedBox>
      </Box> */}
      <Box maxWidth={{ xs: 348, sm: '98%', md: '94%', lg: '68%' }}>
        <BorderedBox>
          <NewsSummary userProfile={userProfile} />
        </BorderedBox>
      </Box>
    </Box>
  )
}

export default MidMarketSummary

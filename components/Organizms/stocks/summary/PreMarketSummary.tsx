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

const PreMarketSummary = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const mutateKey = 'RecentEarnings'
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
  return (
    <Box display={'flex'} gap={1} flexWrap={'wrap'}>
      <Box>
        <BorderedBox>
          <CommoditiesSummary />
        </BorderedBox>
      </Box>
      <Box>
        <BorderedBox>
          <EarningsSummary userProfile={userProfile} data={data} title='Upcoming Earnings' isLoading={isLoading || isValidatingProfile} />
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

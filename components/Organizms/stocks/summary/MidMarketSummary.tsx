import { Box, Typography } from '@mui/material'
import TopMoversSummary from './TopMoversSummary'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import CommoditiesSummary from './CommoditiesSummary'
import SummaryTitle from './SummaryTitle'
import ReportedEarnings from './earnings/ReportedEarnings'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { filterResult } from '../earnings/earningsCalendar'
import dayjs from 'dayjs'
import { getCurrentDateTimeUsEastern } from 'lib/util/dateUtil'
import { sleep } from 'lib/util/timers'
import EarningsSummary from './earnings/EarningsSummary'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const MidMarketSummary = () => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    await sleep(500)
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings
      .filter((e) => e.ActualEarnings)
      .map((m) => {
        return { ...m, ReportDate: dayjs(m.ReportDate).format() }
      })
    const today = dayjs(dayjs(getCurrentDateTimeUsEastern()).format('YYYY-MM-DD')).subtract(1, 'days').format()
    const result = filterResult(mapped, today)
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box>
      <Box display={'flex'} gap={1} height={430}>
        <BorderedBox display={'flex'} width={380}>
          <TopMoversSummary />
        </BorderedBox>
        <BorderedBox display={'flex'} width={440}>
          <CommoditiesSummary />
        </BorderedBox>
        <BorderedBox display={'flex'} width={360}>
          {isLoading && (
            <Box display={'flex'} justifyContent={'center'}>
              <ComponentLoader />
            </Box>
          )}
          {data && <EarningsSummary data={data} title='Reported Earnings' />}
        </BorderedBox>
      </Box>
    </Box>
  )
}

export default MidMarketSummary

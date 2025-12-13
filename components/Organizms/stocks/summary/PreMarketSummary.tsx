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
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'

const PreMarketSummary = () => {
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
    <Box display={'flex'} gap={1}>
      <BorderedBox display={'flex'} flex={'1 1 auto'}>
        <ScrollableBoxHorizontal maxWidth={500}>
          <CommoditiesSummary />
        </ScrollableBoxHorizontal>
      </BorderedBox>
      <BorderedBox display={'flex'} flex={'1 1 auto'}>
        <ScrollableBoxHorizontal maxWidth={350}>
          <EarningsSummary data={data} title='Upcoming Earnings' isLoading={isLoading} />
        </ScrollableBoxHorizontal>
      </BorderedBox>
    </Box>
  )
}

export default PreMarketSummary

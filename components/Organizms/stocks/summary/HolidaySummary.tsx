import { Box } from '@mui/material'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import CommoditiesSummary from './CommoditiesSummary'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { useSwrHelper } from 'hooks/useSwrHelper'
import dayjs from 'dayjs'
import { sleep } from 'lib/util/timers'
import EarningsSummary from './earnings/EarningsSummary'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'
import { usePolling } from 'hooks/usePolling'
import { useEffect } from 'react'
import { mutate } from 'swr'
import { sortArray } from 'lib/util/collections'
import { filterResult } from '../earnings/earningsCalendar'

interface Model {
  reportedEarnings: StockEarning[]
  upcomingEarnings: StockEarning[]
}

const HolidaySummary = ({ nextOpenDt }: { nextOpenDt: string }) => {
  const mutateKey = 'RecentEarnings'
  const dataFn = async () => {
    await sleep(500)
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings.map((m) => {
      return { ...m, ReportDate: dayjs(m.ReportDate).format() }
    })
    const recent = sortArray(
      mapped.filter((m) => m.ActualEarnings),
      ['ReportDate'],
      ['desc'],
    )
    const upcoming = filterResult(mapped, dayjs(nextOpenDt).format())
    const result: Model = {
      reportedEarnings: recent,
      upcomingEarnings: upcoming,
    }
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const { pollCounter } = usePolling(1000 * 240) // 4 minutes

  useEffect(() => {
    const fn = async () => {
      await sleep(250)
      mutate(mutateKey)
    }
    fn()
  }, [pollCounter])

  return (
    <Box display={'flex'} gap={1} flexWrap={'wrap'}>
      <BorderedBox display={'flex'} flex={'1 1 auto'}>
        <ScrollableBoxHorizontal maxWidth={350}>
          <EarningsSummary data={data?.reportedEarnings} title='Reported Earnings' isLoading={isLoading} />
        </ScrollableBoxHorizontal>
      </BorderedBox>
      <BorderedBox display={'flex'} flex={'1 1 auto'}>
        <ScrollableBoxHorizontal maxWidth={350}>
          <EarningsSummary data={data?.upcomingEarnings} title='Upcoming Earnings' isLoading={isLoading} />
        </ScrollableBoxHorizontal>
      </BorderedBox>
      <BorderedBox display={'flex'} flex={'1 1 auto'}>
        <ScrollableBoxHorizontal maxWidth={600}>
          <CommoditiesSummary />
        </ScrollableBoxHorizontal>
      </BorderedBox>
    </Box>
  )
}

export default HolidaySummary

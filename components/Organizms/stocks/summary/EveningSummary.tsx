import { Box } from '@mui/material'
import TopMoversSummary from './TopMoversSummary'
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

const EveningSummary = () => {
  const mutateKey = 'stock-reported-earnings-all'
  const dataFn = async () => {
    await sleep(500)
    const resp = await serverGetFetch('/RecentEarnings')
    const earnings = resp.Body as StockEarning[]
    const mapped: StockEarning[] = earnings
      .filter((e) => e.ActualEarnings)
      .map((m) => {
        return { ...m, ReportDate: dayjs(m.ReportDate).format('YYYY-MM-DD') }
      })
    let result = mapped.filter((e) => e.ActualEarnings)
    result = sortArray(result, ['ReportDate'], ['desc'])
    //result = orderBy(result, ['StockQuote.MarketCap'], ['desc'])
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
      <BorderedBox display={'flex'} flex={{ xs: '1 1 auto', md: 'unset' }}>
        <ScrollableBoxHorizontal maxWidth={350}>
          <EarningsSummary data={data} title='Reported Earnings' isLoading={isLoading} />
        </ScrollableBoxHorizontal>
      </BorderedBox>
      <BorderedBox display={'flex'} flex={{ xs: '1 1 auto', md: 'unset' }}>
        <ScrollableBoxHorizontal maxWidth={600}>
          <CommoditiesSummary />
        </ScrollableBoxHorizontal>
      </BorderedBox>
    </Box>
  )
}

export default EveningSummary

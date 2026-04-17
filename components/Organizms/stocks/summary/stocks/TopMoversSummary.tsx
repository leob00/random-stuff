'use client'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useEffect } from 'react'
import { StockAdvancedSearchFilter } from '../../advanced-search/advancedSearchFilter'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StockListSummary from './StockListSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { orderBy } from 'lodash'
import { useRouter } from 'next/navigation'

const TopMoversSummary = ({ userProfile, showCompanyName = true }: { userProfile: UserProfile | null; showCompanyName?: boolean }) => {
  const mutateKey = 'stock-market-summary-top-movers'
  const { pollCounter } = usePolling(1000 * 360) // 3 minutes
  const router = useRouter()

  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const topMoverFilter: StockAdvancedSearchFilter = {
      take: 100,
      marketCap: {
        includeLargeCap: true,
        includeMegaCap: true,
      },
      movingAvg: {
        days: 1,
      },
    }
    const topMoversResp = await executeStockAdvancedSearch(topMoverFilter)
    let result = topMoversResp.Body as StockQuote[]
    result = orderBy(result, (m) => Math.abs(m.ChangePercent), ['desc'])
    return result
  }
  const onRefreshRequest = () => {
    mutate(mutateKey)
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const onGoToPage = () => {
    router.push('/market/stocks/reports/topmvgavg')
  }
  useEffect(() => {
    if (pollCounter >= 1) {
      mutate(mutateKey)
    }
  }, [pollCounter])

  return (
    <StockListSummary
      userProfile={userProfile}
      data={data}
      title='Top Movers'
      isLoading={isLoading}
      onRefreshRequest={onRefreshRequest}
      showCompanyName={showCompanyName}
      onGoToPage={onGoToPage}
    />
  )
}

export default TopMoversSummary

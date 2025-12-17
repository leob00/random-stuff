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

const TopMoversSummary = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const mutateKey = 'stock-market-summary-top-movers'
  const { pollCounter } = usePolling(1000 * 360) // 3 minutes

  useEffect(() => {
    mutate(mutateKey)
  }, [pollCounter])

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
    const result = topMoversResp.Body as StockQuote[]
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return <StockListSummary userProfile={userProfile} data={data} title='Top Movers' isLoading={isLoading} />
}

export default TopMoversSummary

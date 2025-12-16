'use client'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useEffect } from 'react'
import { StockAdvancedSearchFilter } from '../../advanced-search/advancedSearchFilter'
import { executeStockAdvancedSearch, getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { sleep } from 'lib/util/timers'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { usePolling } from 'hooks/usePolling'
import { mutate } from 'swr'
import { CategoryType, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StockListSummary from './StockListSummary'
import { getRandomInteger } from 'lib/util/numberUtil'
import { searchDynamoItemsByCategory } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'

const RecentlySearchedStocksSummary = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const mutateKey = 'searched-stocks'
  const { pollCounter } = usePolling(1000 * 56) // 56 seconds

  useEffect(() => {
    mutate(mutateKey)
  }, [pollCounter])
  const dataFn = async () => {
    await sleep(getRandomInteger(250, 2500))
    const searchedStocksResult = await searchDynamoItemsByCategory(mutateKey)
    const sorted = sortArray(searchedStocksResult, ['last_modified'], ['desc'])
    const result: StockQuote[] = sorted.map((m) => {
      return JSON.parse(m.data)
    })
    const stockMap = new Map<string, StockQuote>()
    const latest = await getLatestQuotes(result.map((m) => m.Symbol))
    result.forEach((item) => {
      const found = latest.find((m) => m.Symbol === item.Symbol)
      if (found) {
        stockMap.set(item.Symbol, found)
      } else {
        stockMap.set(item.Symbol, item)
      }
    })
    return Array.from(stockMap.values())
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return <StockListSummary userProfile={userProfile} data={data} title='Recently Searched' isLoading={isLoading} />
}

export default RecentlySearchedStocksSummary

import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import CommunityStocksLayout from './CommunityStocksLayout'
import useSWR from 'swr'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { CategoryType } from 'lib/backend/api/aws/apiGateway'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { getLatestQuotes } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'

const RecentlySearchedLayout = () => {
  const searchedStocksKey: CategoryType = 'searched-stocks'

  const recentlySearchedEnc = encodeURIComponent(weakEncrypt(`${searchedStocksKey}`))
  const recentlySearchedMutateKey = ['/api/searchRandomStuff', recentlySearchedEnc]

  const fetchRecentlySearched = async (url: string, enc: string) => {
    const searchedStocksResult = await searchRecords(searchedStocksKey)
    const searchedStocks: StockQuote[] = []
    orderBy(searchedStocksResult, ['last_modified'], ['desc']).forEach((item) => {
      searchedStocks.push(JSON.parse(item.data))
    })
    const latest = await getLatestQuotes(searchedStocks.map((m) => m.Symbol))
    return latest
  }

  const { data: searchedStocks, isLoading, isValidating } = useSWR(recentlySearchedMutateKey, ([url, enc]) => fetchRecentlySearched(url, enc))
  return (
    <>
      {isLoading && (
        <>
          <BackdropLoader />
          <LargeGridSkeleton />
        </>
      )}

      {searchedStocks && <>{searchedStocks && <CommunityStocksLayout data={searchedStocks} defaultSort={false} />}</>}
    </>
  )
}

export default RecentlySearchedLayout

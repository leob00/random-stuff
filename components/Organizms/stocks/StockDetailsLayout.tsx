import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { Sort, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import useSWR, { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import StocksDisplay from './StocksDisplay'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import AddQuote from './AddQuote'
import { getMapFromArray } from 'lib/util/collectionsNative'
import StockListItem from './StockListItem'

const StockDetailsLayout = ({ userProfile, symbol }: { userProfile: UserProfile | null; symbol: string }) => {
  const mutateKey = ['/api/baseRoute', symbol]
  const fetchData = async (url: string, id: string) => {
    const result = await getStockQuotes([id])
    return result
  }
  const { data: stocks, isLoading, isValidating } = useSWR(mutateKey, ([url, id]) => fetchData(url, symbol))

  const handleMutated = (newData: StockQuote[]) => {
    mutate(mutateKey, newData, { revalidate: false })
  }
  const handleCustomSortUpdate = (data?: Sort[]) => {}

  return (
    <>
      {isLoading && (
        <>
          <LargeGridSkeleton />
        </>
      )}
      {stocks && stocks.length > 0 && <StockListItem isStock item={stocks[0]} expand scrollIntoView />}
    </>
  )
}

export default StockDetailsLayout
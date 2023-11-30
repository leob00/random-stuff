import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { Sort, UserProfile } from 'lib/backend/api/aws/apiGateway'
import useSWR, { mutate } from 'swr'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import StockListItem from './StockListItem'

const StockDetailsLayout = ({ symbol }: { symbol: string }) => {
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

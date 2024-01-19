import React from 'react'
import useSWR from 'swr'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import StockListItem from './StockListItem'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const StockDetailsLayout = ({ symbol }: { symbol: string }) => {
  const mutateKey = ['/api/baseRoute', symbol]
  const fetchData = async (url: string, id: string) => {
    const result = await getStockQuotes([id])
    return result
  }
  const { data: stocks, isLoading, isValidating } = useSWR(mutateKey, ([url, id]) => fetchData(url, symbol))

  return (
    <>
      {isLoading && <BackdropLoader />}
      {stocks && stocks.length > 0 && <StockListItem isStock item={stocks[0]} expand scrollIntoView />}
    </>
  )
}

export default StockDetailsLayout

import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { usePager } from 'hooks/usePager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import CommunityStocksLayout from './CommunityStocksLayout'

const CommunityStocksWrapper = ({ data, isLoading }: { data: StockQuote[] | undefined; isLoading: boolean }) => {
  const pager = usePager(data ?? [], 5)
  if (!data) {
    return <BackdropLoader />
  }
  return <>{!isLoading && <CommunityStocksLayout data={pager.allItems as StockQuote[]} pager={pager} isLoading={isLoading} />}</>
}

export default CommunityStocksWrapper

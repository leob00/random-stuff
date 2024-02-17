import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { ListPager, usePager } from 'hooks/usePager'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import CommunityStocksLayout from './CommunityStocksLayout'
import PagedStockTable from './PagedStockTable'

const CommunityStocksWrapper = ({ data }: { data: StockQuote[] | undefined }) => {
  const pager = usePager(data ?? [], 5)
  if (!data) {
    return <BackdropLoader />
  }
  return <CommunityStocksLayout data={pager.allItems as StockQuote[]} pager={pager} />
}

export default CommunityStocksWrapper

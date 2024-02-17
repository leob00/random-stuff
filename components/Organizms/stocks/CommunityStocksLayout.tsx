import { Box } from '@mui/material'
import { ListPager } from 'hooks/usePager'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import PagedStockTable from './PagedStockTable'

const CommunityStocksLayout = ({ data, pager }: { data: StockQuote[]; pageSize?: number; pager: ListPager }) => {
  return (
    <Box py={1}>
      <PagedStockTable data={data} pager={pager} />
    </Box>
  )
}

export default CommunityStocksLayout

import { Box } from '@mui/material'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { orderBy } from 'lodash'
import React from 'react'
import PagedStockTable from './PagedStockTable'

const CommunityStocksLayout = ({ data, defaultSort, pageSize = 10 }: { data: StockQuote[]; defaultSort: Sort[]; pageSize?: number }) => {
  const stocks =
    defaultSort.length > 0
      ? orderBy(
          data,
          defaultSort.map((k) => k.key),
          defaultSort.map((d) => d.direction),
        )
      : [...data]

  return (
    <Box py={1}>
      <PagedStockTable data={stocks} />
    </Box>
  )
}

export default CommunityStocksLayout

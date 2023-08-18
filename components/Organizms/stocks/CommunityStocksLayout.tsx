import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { Sort } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPagedArray } from 'lib/util/collections'
import { orderBy } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

const CommunityStocksLayout = ({ data, defaultSort, pageSize = 10 }: { data: StockQuote[]; defaultSort: Sort[]; pageSize?: number }) => {
  const stocks =
    defaultSort.length > 0
      ? orderBy(
          data,
          defaultSort.map((k) => k.key),
          defaultSort.map((d) => d.direction),
        )
      : [...data]
  const pagedStocks = getPagedArray(stocks, pageSize)

  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
  }
  return (
    <Box py={1}>
      <StockTable
        stockList={pagedStocks[currentPageIndex - 1].items}
        isStock={true}
        showGroupName={false}
        showSummary={false}
        // scrollIntoView
        // scrollMargin={-28}
      />
      <Box pt={4}>
        <Pager
          pageCount={pagedStocks.length}
          itemCount={pagedStocks[currentPageIndex - 1].items.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={currentPageIndex}
          totalItemCount={stocks.length}
        ></Pager>
      </Box>
    </Box>
  )
}

export default CommunityStocksLayout

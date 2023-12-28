import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPagedArray } from 'lib/util/collections'
import React from 'react'
import StockTable from './StockTable'

const PagedStockTable = ({ data, pageSize = 10 }: { data: StockQuote[]; pageSize?: number }) => {
  const pagedStocks = getPagedArray(data, pageSize)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
  }

  return (
    <>
      <StockTable stockList={pagedStocks[currentPageIndex - 1].items} isStock={true} showGroupName={false} showSummary={false} />
      <Box pt={4}>
        <Pager
          pageCount={pagedStocks.length}
          itemCount={pagedStocks[currentPageIndex - 1].items.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={currentPageIndex}
          totalItemCount={data.length}
        ></Pager>
      </Box>
    </>
  )
}

export default PagedStockTable

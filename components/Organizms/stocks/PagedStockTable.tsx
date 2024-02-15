import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { usePager } from 'hooks/usePager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockTable from './StockTable'

const PagedStockTable = ({ data, pageSize = 5 }: { data: StockQuote[]; pageSize?: number }) => {
  const { page, setPage, displayItems, pageCount } = usePager(data, pageSize)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }
  return (
    <>
      <StockTable stockList={displayItems} isStock={true} showGroupName={false} showSummary={false} />
      <Pager
        pageCount={pageCount}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={page}
        totalItemCount={data.length}
        showHorizontalDivider={false}
      ></Pager>
    </>
  )
}
export default PagedStockTable

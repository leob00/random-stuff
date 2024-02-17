import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { ListPager, usePager } from 'hooks/usePager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockTable from './StockTable'

const PagedStockTable = ({ data, pageSize = 5, pager }: { data: StockQuote[]; pageSize?: number; pager: ListPager }) => {
  const { page, setPage, displayItems, pageCount } = pager
  const items = displayItems as StockQuote[]
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }
  return (
    <>
      <StockTable stockList={items} isStock={true} showGroupName={false} showSummary={false} />
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

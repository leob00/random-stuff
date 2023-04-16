import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPagedArray } from 'lib/util/collections'
import { findLast } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

const CommunityStocksLayout = ({ data }: { data: StockQuote[] }) => {
  const pageSize = 5
  const paged = getPagedArray(data, pageSize)
  const [pages, setPages] = React.useState(paged)
  const [originalData, setOriginalData] = React.useState(data)
  const [displayedItems, setDisplayedItems] = React.useState<StockQuote[]>(paged[0].items)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(pages, (p) => {
      return p.index === pageNum
    })
    if (page) {
      setDisplayedItems(page.items)
    }
  }
  return (
    <Box py={1}>
      <StockTable stockList={displayedItems} />
      <Pager
        pageCount={paged.length}
        itemCount={data.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={currentPageIndex}
      ></Pager>
    </Box>
  )
}

export default CommunityStocksLayout

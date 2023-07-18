import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getCommunityStocks } from 'lib/backend/csr/nextApiWrapper'
import { getPagedArray } from 'lib/util/collections'
import { areObjectsEqual } from 'lib/util/objects'
import { findLast, orderBy } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

const CommunityStocksLayout = ({ data, defaultSort = true, pageSize = 10 }: { data: StockQuote[]; defaultSort?: boolean; pageSize?: number }) => {
  const stocks = defaultSort ? orderBy(data, ['Company'], ['asc']) : [...data]
  const pagedStocks = getPagedArray(stocks, pageSize)

  const [displayedItems, setDisplayedItems] = React.useState<StockQuote[]>(pagedStocks[0].items)
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)

  //setOriginalData(stocks)

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(pagedStocks, (p) => {
      return p.index === pageNum
    })
    if (page) {
      setDisplayedItems(page.items)
    }
  }
  return (
    <Box py={1}>
      <StockTable stockList={displayedItems} isStock={true} showGroupName={false} showSummary={false} />
      <Box pt={4}>
        <Pager
          pageCount={pagedStocks.length}
          itemCount={data.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={currentPageIndex}
        ></Pager>
      </Box>
    </Box>
  )
}

export default CommunityStocksLayout

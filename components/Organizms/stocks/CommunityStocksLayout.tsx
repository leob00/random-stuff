import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getCommunityStocks } from 'lib/backend/csr/nextApiWrapper'
import { getPagedArray } from 'lib/util/collections'
import { areObjectsEqual } from 'lib/util/objects'
import { findLast, orderBy } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

const CommunityStocksLayout = ({ data }: { data: StockQuote[] }) => {
  const pageSize = 5
  const paged = getPagedArray(data, pageSize)
  const [pages, setPages] = React.useState(paged)
  const [displayedItems, setDisplayedItems] = React.useState<StockQuote[]>(paged[0].items)
  const [originalData, setOriginalData] = React.useState(data)
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

  React.useEffect(() => {
    const fn = async () => {
      const result = await getCommunityStocks()
      const stocks = orderBy(result, ['Company'], ['asc'])
      if (!areObjectsEqual(data, stocks)) {
        console.log(`data: ${data.length} apiData: ${stocks.length}`)
        console.log('stocks are stale. re-rendering list')
        const pagedStocks = getPagedArray(stocks, pageSize)
        setPages(pagedStocks)
        setDisplayedItems(pagedStocks[0].items)
        setOriginalData(stocks)
      } else {
        console.log('stocks are up to date')
      }
      //console.log(JSON.stringify(stocks))
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

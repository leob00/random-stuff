import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockTable from './StockTable'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useEffect } from 'react'
import { StockQuoteSort } from 'lib/backend/api/models/collections'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const PagedStockTable = ({
  data,
  showGroupName = false,
  pageSize = 5,
  sort,
  featuredField,
  scrollOnPageChange = true,
  showTopPager = false,
  onPageChanged,
  scrollInside = false,
}: {
  data: StockQuote[]
  showGroupName?: boolean
  pageSize?: number
  sort?: StockQuoteSort[]
  featuredField?: keyof StockQuote
  scrollOnPageChange?: boolean
  showTopPager?: boolean
  onPageChanged?: (pageNum?: number) => void
  scrollInside?: boolean
}) => {
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const scroller = useScrollTop(0)
  const handlePaged = (pageNum: number) => {
    if (scrollOnPageChange) {
      scroller.scroll()
    }
    setPage(pageNum)
    onPageChanged?.(pageNum)
  }
  useEffect(() => {
    if (sort) {
      reset(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  return (
    <>
      <Box>
        {showTopPager && (
          <Pager
            pageCount={pagerModel.totalNumberOfPages}
            itemCount={items.length}
            itemsPerPage={pageSize}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={pagerModel.page}
            totalItemCount={pagerModel.totalNumberOfItems}
            showHorizontalDivider={false}
          ></Pager>
        )}
        {scrollInside ? (
          <ScrollableBox scroller={scroller}>
            <StockTable stockList={items} marketCategory={'stocks'} showGroupName={showGroupName} showSummary={false} featuredField={featuredField} />
          </ScrollableBox>
        ) : (
          <StockTable stockList={items} marketCategory={'stocks'} showGroupName={showGroupName} showSummary={false} featuredField={featuredField} />
        )}
      </Box>
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={items.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
        showHorizontalDivider={false}
      ></Pager>
    </>
  )
}
export default PagedStockTable

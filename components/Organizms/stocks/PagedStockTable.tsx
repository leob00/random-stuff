import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockTable from './StockTable'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useEffect } from 'react'
import { StockQuoteSort } from 'lib/backend/api/models/collections'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const PagedStockTable = ({
  data,
  showGroupName = false,
  pageSize = 5,
  sort,
  scrollOnPageChange = true,
  showTopPager = false,
  onPageChanged,
  scrollInside = false,
  showMovingAvgOnly = false,
  featuredFields,
}: {
  data: StockQuote[]
  showGroupName?: boolean
  pageSize?: number
  sort?: StockQuoteSort[]
  scrollOnPageChange?: boolean
  showTopPager?: boolean
  onPageChanged?: (pageNum?: number) => void
  scrollInside?: boolean
  showMovingAvgOnly?: boolean
  featuredFields?: Array<keyof StockQuote>
}) => {
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const scroller = useScrollTop(0)
  const { userProfile, isValidating } = useProfileValidator()
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
      {!isValidating && (
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
                <StockTable
                  stockList={items}
                  marketCategory={'stocks'}
                  showGroupName={showGroupName}
                  showSummary={false}
                  userProfile={userProfile}
                  featuredFields={featuredFields}
                />
              </ScrollableBox>
            ) : (
              <Box minHeight={300}>
                <StockTable
                  stockList={items}
                  marketCategory={'stocks'}
                  showGroupName={showGroupName}
                  showSummary={false}
                  showMovingAvgOnly={showMovingAvgOnly}
                  userProfile={userProfile}
                  featuredFields={featuredFields}
                />
              </Box>
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
      )}
    </>
  )
}
export default PagedStockTable

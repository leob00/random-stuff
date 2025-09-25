import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useEffect } from 'react'
import { StockQuoteSort } from 'lib/backend/api/models/collections'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import StockTable from '../../StockTable'
import { StockAdvancedSearchFilter } from '../advancedSearchFilter'
import { StockFilterSummary } from '../stocksAdvancedSearch'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'

const SearchResultsTable = ({
  data,
  pageSize = 5,
  onPageChanged,
  filterSummary,
}: {
  data: StockQuote[]
  pageSize?: number
  onPageChanged?: (pageNum?: number) => void
  filterSummary?: StockFilterSummary
}) => {
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const { userProfile, isValidating } = useProfileValidator()
  let featuredFields: Array<keyof StockQuote> = []
  if (filterSummary) {
    if (filterSummary.hasMarketCap) {
      featuredFields.push('MarketCapShort')
    }
    if (filterSummary.hasMovingAverage) {
      featuredFields.push('MovingAvgDays')
      featuredFields.push('MovingAvg')
    }

    if (filterSummary.hasPeRatio) {
      featuredFields.push('PeRatio')
    }
    if (filterSummary.hasAnnualYield) {
      featuredFields.push('AnnualDividendYield')
    }
  }

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    onPageChanged?.(pageNum)
  }

  const showMovingAvgOnly = featuredFields.includes('MovingAvg') && items.some((m) => m.MovingAvgDays && m.MovingAvgDays > 1)

  return (
    <>
      {!isValidating && (
        <>
          <ScrollIntoView margin={-24} />

          <Box>
            <Box minHeight={300}>
              <StockTable
                stockList={items}
                marketCategory={'stocks'}
                showSummary={false}
                userProfile={userProfile}
                featuredFields={featuredFields}
                showMovingAvgOnly={showMovingAvgOnly}
              />
            </Box>
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
export default SearchResultsTable

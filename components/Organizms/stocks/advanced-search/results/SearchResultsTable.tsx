import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { StockFilterSummary } from '../stocksAdvancedSearch'
import PagedStockTable from '../../PagedStockTable'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'

const SearchResultsTable = ({
  data,
  onPageChanged,
  filterSummary,
}: {
  data: StockQuote[]
  onPageChanged?: (pageNum?: number) => void
  filterSummary?: StockFilterSummary
}) => {
  const { isValidating } = useProfileValidator()
  const scroller = useScrollTop(0)

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

  const handlePaged = (pageNum?: number) => {
    // setPage(pageNum ?? 1)
    onPageChanged?.(pageNum)
    scroller.scroll()
  }

  const showMovingAvgOnly = featuredFields.includes('MovingAvg') && data.some((m) => m.MovingAvgDays && m.MovingAvgDays > 1)

  return (
    <>
      {!isValidating && (
        <>
          <Box>
            <ScrollTop scroller={scroller} marginTop={-22} />
            <PagedStockTable
              data={data}
              featuredFields={featuredFields}
              showMovingAvgOnly={showMovingAvgOnly}
              onPageChanged={handlePaged}
              //scrollOnPageChange
            />
          </Box>
        </>
      )}
    </>
  )
}
export default SearchResultsTable

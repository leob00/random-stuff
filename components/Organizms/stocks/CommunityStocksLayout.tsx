import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockTable from './PagedStockTable'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'

const CommunityStocksLayout = ({ data, onPageChange }: { data: StockQuote[]; pageSize?: number; onPageChange?: (pageNum?: number) => void }) => {
  const scroller = useScrollTop(0)

  const handlePageChange = () => {
    scroller.scroll()
    onPageChange?.()
  }

  return (
    <>
      <ScrollTop scroller={scroller} marginTop={-18} />
      <Box py={1}>
        <PagedStockTable data={data} pageSize={5} onPageChanged={handlePageChange} />
      </Box>
    </>
  )
}

export default CommunityStocksLayout

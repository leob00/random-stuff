import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockTable from './PagedStockTable'

const CommunityStocksLayout = ({ data }: { data: StockQuote[]; pageSize?: number }) => {
  return (
    <Box py={1}>
      <PagedStockTable data={data} />
    </Box>
  )
}

export default CommunityStocksLayout

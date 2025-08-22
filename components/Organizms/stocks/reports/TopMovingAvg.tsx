import { serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import PagedStockTable from '../PagedStockTable'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { Box } from '@mui/material'
import { useState } from 'react'
import StockMovingAvgFilterForm from './StockMovingAvgFilterForm'
import { StockMovingAvgFilter } from './stockMovingAvgFilter'

const TopMovingAvg = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const dataFn = async () => {
    const resp = await serverPostFetch(
      {
        body: {
          Take: 100,
          Days: 1,
          MarketCap: {
            Items: ['mega'],
          },
        },
      },
      `/StockMovingAvg`,
    )
    const result = resp.Body as StockQuote[]
    return result
  }
  const { data, isLoading } = useSwrHelper('topmvgavg', dataFn, { revalidateOnFocus: true })

  const handleSubmit = (item: StockMovingAvgFilter) => {}

  return (
    <Box>
      {isFilterExpanded && (
        <Box>
          <StockMovingAvgFilterForm onSubmitted={handleSubmit} />
        </Box>
      )}
      {isLoading && <BackdropLoader />}
      {data && <PagedStockTable data={data} pageSize={10} scrollOnPageChange />}
    </Box>
  )
}

export default TopMovingAvg

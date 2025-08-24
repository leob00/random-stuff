import { serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import PagedStockTable from '../PagedStockTable'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { Box, IconButton } from '@mui/material'
import { useState } from 'react'
import StockMovingAvgFilterForm from './StockMovingAvgFilterForm'
import { StockMovingAvgFilter } from './stockMovingAvgFilter'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { mutate } from 'swr'

const mutateKey = 'topmvgavg'

const TopMovingAvg = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const { getStockTopMovingAvgFilter, setStockMovingAvgFilter } = useLocalStore()

  const dataFn = async () => {
    const filter = getStockTopMovingAvgFilter()
    const resp = await serverPostFetch(
      {
        body: {
          Take: filter.take,
          Days: filter.days,
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
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleSubmit = (item: StockMovingAvgFilter) => {
    setIsFilterExpanded(false)
    setStockMovingAvgFilter(item)
    mutate(mutateKey)
  }

  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-end'} pr={1}>
        <IconButton size='small' color='primary' onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
          <FilterAltIcon fontSize='small' />
        </IconButton>
      </Box>
      {isFilterExpanded && (
        <Box>
          <StockMovingAvgFilterForm onSubmitted={handleSubmit} />
        </Box>
      )}
      {isLoading && <BackdropLoader />}
      {data && <PagedStockTable data={data} pageSize={10} scrollOnPageChange showMovingAvgOnly />}
    </Box>
  )
}

export default TopMovingAvg

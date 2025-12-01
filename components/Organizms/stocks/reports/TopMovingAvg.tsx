import { serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import PagedStockTable from '../PagedStockTable'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { Box, IconButton } from '@mui/material'
import { useState } from 'react'
import StockMovingAvgFilterForm from './StockMovingAvgFilterForm'
import { StockMovingAvgFilter } from './stockMovingAvgFilter'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { mutate } from 'swr'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const mutateKey = 'topmvgavg'

type PostBody = {
  body: {
    Take: number
    Days: number
    MarketCap: {
      Items: string[]
    }
  }
}

const TopMovingAvg = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const { getStockTopMovingAvgFilter, setStockMovingAvgFilter } = useLocalStore()

  const dataFn = async () => {
    const filter = getStockTopMovingAvgFilter()
    const body: PostBody = {
      body: {
        Take: filter.take,
        Days: filter.days,
        MarketCap: {
          Items: [],
        },
      },
    }
    const isEmptyMarketCap = !filter.includeMegaCap && !filter.includeLargeCap && !filter.includeMidCap && !filter.includeSmallCap
    if (filter.includeMegaCap) {
      body.body.MarketCap.Items.push('mega')
    }
    if (filter.includeLargeCap) {
      body.body.MarketCap.Items.push('large')
    }
    if (filter.includeMidCap) {
      body.body.MarketCap.Items.push('mid')
    }
    if (filter.includeSmallCap) {
      body.body.MarketCap.Items.push('small')
    }
    if (isEmptyMarketCap) {
      body.body.MarketCap.Items.push('mega')
    }
    const resp = await serverPostFetch(body, `/StockMovingAvg`)
    let result = resp.Body as StockQuote[]
    if (filter.days > 1) {
      result = result.map((m) => {
        return { ...m, Change: m.MovingAvgChange ?? 0, ChangePercent: m.MovingAvg ?? 0 }
      })
    }

    return result
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleSubmit = (filter: StockMovingAvgFilter) => {
    setIsFilterExpanded(false)
    const isEmptyMarketCap = !filter.includeMegaCap && !filter.includeLargeCap && !filter.includeMidCap && !filter.includeSmallCap
    if (isEmptyMarketCap) {
      filter.includeMegaCap = true
    }
    setStockMovingAvgFilter(filter)
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
      {isLoading && <ComponentLoader />}
      {data && <PagedStockTable data={data} pageSize={10} scrollOnPageChange showMovingAvgOnly />}
    </Box>
  )
}

export default TopMovingAvg

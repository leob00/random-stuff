import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { StockAdvancedSearchFilter } from '../advanced-search/advancedSearchFilter'
import { StockQuote } from 'lib/backend/api/models/zModels'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import SearchResultsTable from '../advanced-search/results/SearchResultsTable'
import { take } from 'lodash'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'

const MidMarketSummary = () => {
  const mutateKey = 'stock-market-summary-top-movers'

  const dataFn = async () => {
    const topMoverFilter: StockAdvancedSearchFilter = {
      take: 10,
      marketCap: {
        includeLargeCap: true,
        includeMegaCap: true,
      },
      movingAvg: {
        days: 1,
      },
    }
    const topMoversResp = await executeStockAdvancedSearch(topMoverFilter)
    const result = topMoversResp.Body as StockQuote[]
    return take(result, 10)
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box>
      <CenterStack sx={{ ml: -2 }}>
        <Typography variant='h5'>Top Movers</Typography>
      </CenterStack>
      {isLoading && <ComponentLoader />}
      {data && (
        <Box>
          <SearchResultsTable data={data} disableStockDetailClick />
        </Box>
      )}
    </Box>
  )
}

export default MidMarketSummary

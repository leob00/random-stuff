import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import WarmupBox from 'components/Atoms/WarmupBox'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getNewsBySymbol, getStockEarnings, getStockQuotes, NewsItem, StockEarning } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import NewsList from '../../news/NewsList'
import StockEarningsTable from './StockEarningsTable'

const StockEarnings = ({ quote }: { quote: StockQuote }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<StockEarning[]>([])

  React.useEffect(() => {
    const fn = async () => {
      const apiData = await getStockEarnings(quote.Symbol)
      setData(apiData)
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading ? (
        <BackdropLoader />
      ) : (
        <>
          <Box sx={{ py: 2 }}>
            <StockEarningsTable data={data} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default StockEarnings

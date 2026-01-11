import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import StockEarningsDisplay from './StockEarningsDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const StockEarnings = ({ quote }: { quote: StockQuote }) => {
  const mutateKey = `stock-earnings-${quote.Symbol}`

  const dataFn = async () => {
    const resp = await serverGetFetch(`/StockEarnings?symbol=${quote.Symbol}`)
    const result = resp.Body as StockEarning[]
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading && <ComponentLoader />}
      <Box sx={{ py: 2 }}>{data && <StockEarningsDisplay symbol={quote.Symbol} data={data} />}</Box>
    </Box>
  )
}

export default StockEarnings

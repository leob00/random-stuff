import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch, StockEarning } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockEarningsTable from './StockEarningsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'

const StockEarnings = ({ quote }: { quote: StockQuote }) => {
  const mutateKey = `stock-earnings-${quote.Symbol}`

  const dataFn = async () => {
    const endpoint = `/StockEarnings?symbol=${quote.Symbol}`
    const resp = await serverGetFetch(endpoint)
    const result = resp.Body as StockEarning[]
    return result
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading && <BackdropLoader />}
      <Box sx={{ py: 2 }}>{data && <StockEarningsTable data={data} />}</Box>
    </Box>
  )
}

export default StockEarnings

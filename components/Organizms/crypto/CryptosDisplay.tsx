import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { sortArray } from 'lib/util/collections'
import StockTable from '../stocks/StockTable'
import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const result = filterCryptos(data)

  return (
    <Box>
      <ScrollIntoView enabled />
      <StockTable stockList={result} marketCategory='crypto' showSummary />
    </Box>
  )
}

function filterCryptos(data: StockQuote[]) {
  const displaySymbols = [
    'X:BTCUSD',
    'X:ETHUSD',
    'X:LTCUSD',
    'X:XMRUSD',
    'X:NEOUSD',
    'X:XRPUSD',
    'X:RONINUSD',
    'X:SOLUSD',
    'X:USDTUSD',
    'X:XAUTUSD',
    'X:AVAXUSD',
    'X:DOGEUSD',
  ]
  const result = data.filter((m) => displaySymbols.includes(m.Symbol))
  return sortArray(result, ['Company'], ['asc'])
}

export default CryptosDisplay

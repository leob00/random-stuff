'use client'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockTable from '../stocks/StockTable'
import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useRouter } from 'next/navigation'

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const result = filterCryptos(data)
  const router = useRouter()

  return (
    <Box>
      <ScrollIntoView enabled />

      <StockTable stockList={result} marketCategory='crypto' showSummary userProfile={userProfile} />
    </Box>
  )
}

function filterCryptos(data: StockQuote[]) {
  const displaySymbols = [
    'X:BTCUSD',
    'X:ETHUSD',
    'X:SOLUSD',
    'X:DOGEUSD',
    'X:ADAUSD',
    'X:AVAXUSD',
    'X:TRXUSD',
    'X:LTCUSD',
    'X:XMRUSD',
    'X:NEOUSD',
    'X:XRPUSD',
    'X:RONINUSD',
    'X:BUSDUSD',
    'X:XAUTUSD',
  ]
  const result: StockQuote[] = []
  displaySymbols.forEach((symbol) => {
    const quote = data.find((q) => q.Symbol === symbol)
    if (quote) {
      result.push(quote)
    }
  })
  // const result = data.filter((m) => displaySymbols.includes(m.Symbol))
  return result
}

export default CryptosDisplay

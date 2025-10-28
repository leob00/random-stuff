import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { sortArray } from 'lib/util/collections'
import StockTable from '../stocks/StockTable'
import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import router from 'next/router'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const result = filterCryptos(data)
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuAllStocks text={'stocks'} />,
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/csr/commodities'),
    },
  ]

  return (
    <Box>
      <ScrollIntoView enabled />
      <Box display={'flex'} justifyContent={'flex-end'}>
        <ContextMenu items={menu} />
      </Box>
      <StockTable stockList={result} marketCategory='crypto' showSummary userProfile={userProfile} />
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

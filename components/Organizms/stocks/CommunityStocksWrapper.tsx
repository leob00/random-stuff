import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import CommunityStocksLayout from './CommunityStocksLayout'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import { useRouter } from 'next/navigation'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import { Box } from '@mui/material'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'

const CommunityStocksWrapper = ({ data, onRefresh }: { data?: StockQuote[]; onRefresh: () => void }) => {
  const router = useRouter()

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuRefresh text={'refresh'} />,
      fn: () => {
        onRefresh()
      },
    },

    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuReport text={'reports'} />,
      fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/csr/stocks/earnings-calendar'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/csr/commodities'),
    },
    {
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/csr/crypto'),
    },
  ]

  if (!data) {
    return <BackdropLoader />
  }
  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <ContextMenu items={menu} />
      </Box>

      <CommunityStocksLayout data={data} />
    </Box>
  )
}

export default CommunityStocksWrapper

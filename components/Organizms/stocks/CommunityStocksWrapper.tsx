import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import CommunityStocksLayout from './CommunityStocksLayout'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'

const CommunityStocksWrapper = ({ data, onRefresh }: { data?: StockQuote[]; onRefresh: () => void }) => {
  const router = useRouter()

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuRefresh text={'refresh'} />,
      fn: () => {
        onRefresh()
      },
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

import StockMarketGlance from '../stocks/StockMarketGlance'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { Box } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/navigation'

const UserDashboardLayout = () => {
  const scroller = useScrollTop(0)
  const router = useRouter()

  const onEdit = () => {
    router.push('/protected/csr/dashboard/edit')
  }

  const menu: ContextMenuItem[] = [
    {
      fn: onEdit,
      item: <ContextMenuEdit />,
    },
  ]

  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <ContextMenu items={menu} />
      </Box>
      <ScrollableBox maxHeight={520} scroller={scroller}>
        <StockMarketGlance />
      </ScrollableBox>
    </Box>
  )
}

export default UserDashboardLayout

import { ListItemIcon, ListItemText } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/navigation'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'

const GroupedListMenu = ({ onEdit, onShowAsGroup }: { onEdit: () => void; onShowAsGroup?: (show: boolean) => void }) => {
  const router = useRouter()
  const handleClick = (event: 'edit' | 'showAsGroup') => {
    switch (event) {
      case 'showAsGroup':
        onShowAsGroup?.(true)
        break
      case 'edit':
        onEdit()
        break
    }
  }

  const handleShowGrouped = (grouped: boolean) => {
    onShowAsGroup?.(grouped)
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: () => handleClick('edit'),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <FormatListBulletedIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view as flat list' />
        </>
      ),
      fn: () => handleShowGrouped(false),
    },
    {
      item: <ContextMenuAllStocks text={'stocks'} />,
      fn: () => router.push('/market/stocks/quotes'),
    },
    {
      item: (
        <>
          <ContextMenuReport text='reports' />
        </>
      ),
      fn: () => router.push(`/ssg/stocks/reports/volume-leaders`),
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/market/stocks/earnings/calendar'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/market/commodities'),
    },
    {
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/market/crypto'),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default GroupedListMenu

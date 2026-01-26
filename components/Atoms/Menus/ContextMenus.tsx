import { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import router from 'next/router'
export const myStocksMenu: ContextMenuItem[] = [
  {
    item: <ContextMenuAllStocks />,
    fn: () => router.push('/market/stocks/quotes'),
  },
  {
    item: (
      <>
        <ContextMenuAlert text='manage alerts' />
      </>
    ),
    fn: () => router.push('/market/stocks/alerts'),
  },
  {
    item: (
      <>
        <ContextMenuReport text='reports' />
      </>
    ),
    fn: () => router.push(`/market/stocks/reports/volume-leaders`),
  },
]

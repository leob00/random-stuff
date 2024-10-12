import { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import router from 'next/router'
export const myStocksMenu: ContextMenuItem[] = [
  {
    item: (
      <>
        <ContextMenuPeople text={'community stocks'} />
      </>
    ),
    fn: () => router.push('/csr/community-stocks'),
  },
  {
    item: (
      <>
        <ContextMenuPortfolio text={'portfolio'} />
      </>
    ),
    fn: () => router.push('/csr/stocks/stock-porfolios'),
  },
  {
    item: (
      <>
        <ContextMenuAlert text='manage alerts' />
      </>
    ),
    fn: () => router.push('/csr/stocks/alerts'),
  },
  {
    item: (
      <>
        <ContextMenuReport text='reports' />
      </>
    ),
    fn: () => router.push(`/ssg/stocks/reports/volume-leaders`),
  },
]

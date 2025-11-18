'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuAllStocks from './ContextMenuAllStocks'
import ContextMenuMyStocks from './ContextMenuMyStocks'
import ContextMenuEarnings from './ContextMenuEarnings'
import ContextMenuReport from './ContextMenuReport'
import ContextMenuStockSentiment from './ContextMenuStockSentiment'
import ContextMenuStockAlerts from './ContextMenuStockAlerts'

const StockMarketPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ContextMenuAllStocks />,
        fn: () => router.push('/csr/community-stocks'),
        route: '/csr/community-stocks',
      },
      {
        item: <ContextMenuMyStocks />,
        fn: () => router.push('/csr/my-stocks'),
        route: '/csr/my-stocks',
      },
      {
        item: <ContextMenuStockSentiment text='stock sentiment' />,
        fn: () => router.push('/csr/stocks/sentiment'),
        route: '/csr/stocks/sentiment',
      },
      {
        item: <ContextMenuReport text={'reports'} />,
        fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
        route: '/ssg/stocks/reports/volume-leaders',
      },
      {
        item: <ContextMenuEarnings text={'earnings calendar'} />,
        fn: () => router.push('/csr/stocks/earnings-calendar'),
        route: '/csr/stocks/earnings-calendar',
      },
      {
        item: <ContextMenuStockAlerts />,
        fn: () => router.push('/csr/stocks/alerts'),
        route: '/csr/stocks/alerts',
      },
      // {
      //   item: <ContextMenuCommodities text={'commodities'} />,
      //   fn: () => router.push('/csr/commodities'),
      //   route: '/csr/commodities',
      // },
      // {
      //   item: <ContextMenuCrypto text={'crypto'} />,
      //   fn: () => router.push('/csr/crypto'),
      //   route: '/csr/crypto',
      // },
    ]
    return result.filter((m) => m.route !== pathName)
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default StockMarketPageContextMenu

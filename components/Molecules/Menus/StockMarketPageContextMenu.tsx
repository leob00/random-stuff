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
import ContextMenuSummary from './ContextMenuSummary'

const StockMarketPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ContextMenuAllStocks />,
        fn: () => router.push('/market/stocks/quotes'),
        route: '/market/stocks/quotes',
      },
      {
        item: <ContextMenuMyStocks />,
        fn: () => router.push('/csr/my-stocks'),
        route: '/csr/my-stocks',
      },
      {
        item: <ContextMenuStockSentiment text='stock sentiment' />,
        fn: () => router.push('/market/stocks/sentiment'),
        route: '/market/stocks/sentiment',
      },
      {
        item: <ContextMenuReport text={'reports'} />,
        fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
        route: '/ssg/stocks/reports/volume-leaders',
      },
      {
        item: <ContextMenuSummary />,
        fn: () => router.push('/market/stocks/summary'),
        route: '/market/stocks/summary',
      },
      {
        item: <ContextMenuEarnings text={'earnings calendar'} />,
        fn: () => router.push('/market/stocks/earnings/calendar'),
        route: '/market/stocks/earnings/calendar',
      },
      {
        item: <ContextMenuStockAlerts />,
        fn: () => router.push('/csr/stocks/alerts'),
        route: '/csr/stocks/alerts',
      },
    ]
    return result.filter((m) => m.route !== pathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default StockMarketPageContextMenu

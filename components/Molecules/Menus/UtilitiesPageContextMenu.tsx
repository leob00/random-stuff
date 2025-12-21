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
import ConteMenuCalculator from './ConteMenuCalculator'

const UtilitiesPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ConteMenuCalculator />,
        fn: () => router.push('/csr/calculator'),
        route: '/csr/calculator',
      },
    ]
    return result.filter((m) => m.route !== pathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default UtilitiesPageContextMenu

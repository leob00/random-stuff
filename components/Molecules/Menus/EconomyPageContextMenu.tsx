'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuRequestQuote from './ContextMenuRequestQuote'
import ContextMenuIndicators from './ContextMenuIndicators'

const EconomyPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ContextMenuRequestQuote />,
        route: '/economy/calendar',
        fn: () => router.push('/economy/calendar'),
      },
      {
        item: <ContextMenuIndicators />,
        route: '/economy/indicators',
        fn: () => router.push('/economy/indicators'),
      },
    ]
    return result.filter((m) => m.route !== pathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default EconomyPageContextMenu

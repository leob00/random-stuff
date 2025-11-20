'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuAllStocks from './ContextMenuAllStocks'
import ContextMenuMyStocks from './ContextMenuMyStocks'
import ContextMenuCrypto from './ContextMenuCrypto'
import ContextMenuTreasuries from './ContextMenuTreasuries'
import ContextMenuCommodities from './ContextMenuCommodities'

const OtherMarketsPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ContextMenuCrypto />,
        route: '/csr/crypto',
        fn: () => router.push('/csr/crypto'),
      },
      {
        item: <ContextMenuCommodities />,
        route: '/csr/commodities',
        fn: () => router.push('/csr/commodities'),
      },
      {
        item: <ContextMenuTreasuries />,
        route: '/market/treasuries',
        fn: () => router.push('/market/treasuries'),
      },
      {
        item: <ContextMenuAllStocks text={'stocks'} />,
        route: '/csr/community-stocks',
        fn: () => router.push('/csr/community-stocks'),
      },
      {
        item: <ContextMenuMyStocks />,
        route: '/csr/my-stocks',
        fn: () => router.push('/csr/my-stocks'),
      },
    ]
    return result.filter((m) => m.route !== pathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default OtherMarketsPageContextMenu

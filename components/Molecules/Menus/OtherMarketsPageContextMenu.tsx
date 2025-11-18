'use client'
import { useMediaQuery } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuAllStocks from './ContextMenuAllStocks'
import ContextMenuMyStocks from './ContextMenuMyStocks'
import ContextMenuCrypto from './ContextMenuCrypto'
import ContextMenuTreasuries from './ContextMenuTreasuries'

const OtherMarketsPageContextMenu = () => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
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
      {
        item: <ContextMenuCrypto />,
        route: '/csr/crypto',
        fn: () => router.push('/csr/crypto'),
      },
      {
        item: <ContextMenuTreasuries />,
        route: '/market/treasuries',
        fn: () => router.push('/market/treasuries'),
      },
    ]
    return result.filter((m) => m.route !== pathName)
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default OtherMarketsPageContextMenu

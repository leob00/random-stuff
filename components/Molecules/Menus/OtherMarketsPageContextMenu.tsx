'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuCrypto from './ContextMenuCrypto'
import ContextMenuTreasuries from './ContextMenuTreasuries'
import ContextMenuCommodities from './ContextMenuCommodities'
import ContextMenuRefresh from './ContextMenuRefresh'
import { mutate } from 'swr'
import { MutateKey } from 'lib/backend/api/models/mutateKeys'
import ContextMenuAllStocks from './ContextMenuAllStocks'

const OtherMarketsPageContextMenu = ({ mutateKey }: { mutateKey?: MutateKey }) => {
  const pathName = usePathname()
  const router = useRouter()

  const menu = useMemo(() => {
    const result: ContextMenuItem[] = [
      {
        item: <ContextMenuCrypto />,
        route: '/market/crypto',
        fn: () => router.push('/market/crypto'),
      },
      {
        item: <ContextMenuCommodities />,
        route: '/market/commodities',
        fn: () => router.push('/market/commodities'),
      },
      {
        item: <ContextMenuTreasuries />,
        route: '/market/treasuries',
        fn: () => router.push('/market/treasuries'),
      },
      {
        item: <ContextMenuAllStocks />,
        route: '/market/stocks/quotes',
        fn: () => router.push('/market/stocks/quotes'),
      },
    ]
    if (mutateKey) {
      result.unshift({
        item: <ContextMenuRefresh />,
        fn: () => {
          mutate(mutateKey)
        },
      })
    }
    return result.filter((m) => m.route !== pathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  return <ContextMenu items={menu} />
}

export default OtherMarketsPageContextMenu

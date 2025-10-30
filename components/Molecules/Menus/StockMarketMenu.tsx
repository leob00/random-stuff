'use client'
import { Box } from '@mui/material'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuAllStocks from './ContextMenuAllStocks'
import { useRouter } from 'next/navigation'
import ContextMenuMyStocks from './ContextMenuMyStocks'

const StockMarketMenu = () => {
  const router = useRouter()
  const menu: ContextMenuItem[] = [
    {
      fn: () => router.push('/csr/community-stocks'),
      item: <ContextMenuAllStocks />,
    },
    {
      fn: () => router.push('/csr/community-stocks'),
      item: <ContextMenuMyStocks />,
    },
  ]
  return (
    <Box>
      <ContextMenu items={menu} />
    </Box>
  )
}

export default StockMarketMenu

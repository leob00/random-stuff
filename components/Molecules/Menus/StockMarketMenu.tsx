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
      fn: () => router.push('/market/stocks/quotes'),
      item: <ContextMenuAllStocks />,
    },
    {
      fn: () => router.push('/market/stocks/my'),
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

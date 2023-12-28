import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuSummary from './ContextMenuSummary'

const GoalsMenu = ({ onShowCharts }: { onShowCharts: () => void }) => {
  const handleShowCharts = () => {
    onShowCharts()
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuSummary />,
      fn: handleShowCharts,
    },
  ]
  return <ContextMenu items={contextMenu} />
}

export default GoalsMenu

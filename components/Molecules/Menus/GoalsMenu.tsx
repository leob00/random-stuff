import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuSummary from './ContextMenuSummary'
import ContextMenuAdd from './ContextMenuAdd'

const GoalsMenu = ({ onShowCharts, onAddGoal }: { onShowCharts: () => void; onAddGoal: () => void }) => {
  const handleShowCharts = () => {
    onShowCharts()
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuAdd />,
      fn: onAddGoal,
    },
    {
      item: <ContextMenuSummary />,
      fn: handleShowCharts,
    },
  ]
  return <ContextMenu items={contextMenu} />
}

export default GoalsMenu

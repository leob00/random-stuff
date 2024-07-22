import React from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import ContextMenuSummary from './ContextMenuSummary'
import ContextMenuAdd from './ContextMenuAdd'
import ContextMenuRefresh from './ContextMenuRefresh'

const GoalsMenu = ({ onShowCharts, onAddGoal, onRefresh }: { onShowCharts: () => void; onAddGoal: () => void; onRefresh: () => void }) => {
  const handleShowCharts = () => {
    onShowCharts()
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuRefresh />,
      fn: onRefresh,
    },
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

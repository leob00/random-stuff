import React from 'react'
import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'

const FlatListMenu = ({ onEdit, onRefresh, onShowAsGroup }: { onEdit: () => void; onRefresh: () => void; onShowAsGroup?: (show: boolean) => void }) => {
  const handleClick = (event: 'refresh' | 'edit' | 'showAsGroup') => {
    switch (event) {
      case 'refresh':
        onRefresh()
        break
      case 'showAsGroup':
        onShowAsGroup?.(true)
        break
      case 'edit':
        onEdit()
        break
    }
  }

  const handleShowGrouped = (grouped: boolean) => {
    onShowAsGroup?.(grouped)
  }
  const contextMenu: ContextMenuItem[] = [
    {
      item: (
        <>
          <ContextMenuRefresh />
          <Divider />
        </>
      ),
      fn: () => handleClick('refresh'),
    },
    {
      item: <ContextMenuEdit />,
      fn: () => handleClick('edit'),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <SortIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view by group name' />
        </>
      ),
      fn: () => handleShowGrouped(true),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default FlatListMenu

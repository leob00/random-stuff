import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'

const GroupedListMenu = ({ onEdit, onShowAsGroup }: { onEdit: () => void; onShowAsGroup?: (show: boolean) => void }) => {
  const handleClick = (event: 'edit' | 'showAsGroup') => {
    switch (event) {
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
      item: <ContextMenuEdit />,
      fn: () => handleClick('edit'),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <SortIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view as flat list' />
        </>
      ),
      fn: () => handleShowGrouped(false),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default GroupedListMenu

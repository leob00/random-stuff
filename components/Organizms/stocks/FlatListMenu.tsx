import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import StreetviewIcon from '@mui/icons-material/Streetview'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/router'

const FlatListMenu = ({
  onEdit,
  onShowAsGroup,
  onShowCustomSort,
}: {
  onEdit: () => void
  onShowAsGroup?: (show: boolean) => void
  onShowCustomSort?: () => void
}) => {
  const router = useRouter()
  const handleClick = (event: 'edit' | 'showAsGroup' | 'customSort') => {
    switch (event) {
      case 'showAsGroup':
        onShowAsGroup?.(true)
        break
      case 'customSort':
        onShowCustomSort?.()
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
            <StreetviewIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view by group name' />
        </>
      ),
      fn: () => handleShowGrouped(true),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <SortIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='custom sort' />
        </>
      ),
      fn: () => handleClick('customSort'),
    },
    {
      item: (
        <>
          <ListItemText primary='view community stocks' />
        </>
      ),
      fn: () => router.push('/ssg/community-stocks'),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default FlatListMenu

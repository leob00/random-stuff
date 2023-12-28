import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import StreetviewIcon from '@mui/icons-material/Streetview'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/router'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'

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
            <StreetviewIcon color='primary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view by group name' />
        </>
      ),
      fn: () => handleShowGrouped(true),
    },
    {
      item: (
        <>
          <ContextMenuSort text={'sort'} />
        </>
      ),
      fn: () => handleClick('customSort'),
    },
    {
      item: (
        <>
          <ContextMenuPeople text={'community stocks'} />
        </>
      ),
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: (
        <>
          <ContextMenuPortfolio text={'portfolio'} />
        </>
      ),
      fn: () => router.push('/csr/stocks/stock-porfolios'),
    },
    {
      item: (
        <>
          <ContextMenuAlert text={'manage alerts'} />
        </>
      ),
      fn: () => router.push('/csr/stocks/alerts'),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default FlatListMenu

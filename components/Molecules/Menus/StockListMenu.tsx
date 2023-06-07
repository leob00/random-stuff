import React from 'react'
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import ViewList from '@mui/icons-material/ViewList'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import HamburgerMenu from './HamburgerMenu'
import SortIcon from '@mui/icons-material/Sort'

const StockListMenu = ({ onEdit, onRefresh, onShowAsGroup }: { onEdit: () => void; onRefresh: () => void; onShowAsGroup?: (show: boolean) => void }) => {
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    // setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    // setAnchorEl(null)
  }
  const handleEdit = () => {
    handleCloseMenu()
    onEdit()
  }
  const handleRefresh = () => {
    handleCloseMenu()
    onRefresh()
  }
  const handleClick = (event: 'refresh' | 'edit' | 'showAsGroup') => {
    handleCloseMenu()
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
    handleCloseMenu()
    onShowAsGroup?.(grouped)
  }

  return (
    <HamburgerMenu>
      <MenuList>
        <MenuItem onClick={() => handleClick('refresh')}>
          <ListItemIcon>
            <CachedIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='refresh'></ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem onClick={() => handleClick('edit')}>
          <ListItemIcon>
            <ViewList color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='edit'></ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem onClick={() => handleShowGrouped(true)}>
          <ListItemIcon>
            <SortIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view by group name'></ListItemText>
        </MenuItem>
        <HorizontalDivider />
        <MenuItem onClick={() => handleShowGrouped(false)}>
          <ListItemIcon>
            <SortIcon color='secondary' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view as flat list'></ListItemText>
        </MenuItem>
      </MenuList>
    </HamburgerMenu>
  )
}

export default StockListMenu

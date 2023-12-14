import React from 'react'
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import ViewList from '@mui/icons-material/ViewList'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import HamburgerMenu from './HamburgerMenu'
import { DarkMode } from 'components/themes/DarkMode'
import ContextMenuSort from './ContextMenuSort'

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
    <DarkMode>
      <HamburgerMenu>
        <MenuList>
          <MenuItem onClick={() => handleClick('refresh')}>
            <ListItemIcon>
              <CachedIcon color='primary' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='refresh'></ListItemText>
          </MenuItem>
          <HorizontalDivider />
          <MenuItem onClick={() => handleClick('edit')}>
            <ListItemIcon>
              <ViewList color='primary' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='edit'></ListItemText>
          </MenuItem>
          <HorizontalDivider />
          <MenuItem onClick={() => handleShowGrouped(true)}>
            <ListItemIcon />
            <ListItemText primary='view by group name'></ListItemText>
          </MenuItem>
          <HorizontalDivider />
          <MenuItem onClick={() => handleShowGrouped(false)}>
            <ContextMenuSort text={'view as flat list'} />
          </MenuItem>
        </MenuList>
      </HamburgerMenu>
    </DarkMode>
  )
}

export default StockListMenu

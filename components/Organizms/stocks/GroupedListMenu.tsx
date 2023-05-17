import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Button, ListItemAvatar, ListItem, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Edit, Toc, ViewList } from '@mui/icons-material'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SortIcon from '@mui/icons-material/Sort'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'

const GroupedListMenu = ({ onEdit, onRefresh, onShowAsGroup }: { onEdit: () => void; onRefresh: () => void; onShowAsGroup?: (show: boolean) => void }) => {
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

export default GroupedListMenu

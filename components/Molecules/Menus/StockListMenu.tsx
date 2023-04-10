import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Button, ListItemAvatar, ListItem, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Edit, Toc, ViewList } from '@mui/icons-material'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const StockListMenu = ({ onEdit, onRefresh }: { onEdit: () => void; onRefresh: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleEdit = () => {
    handleCloseMenu()
    onEdit()
  }
  const handleRefresh = () => {
    handleCloseMenu()
    onRefresh()
  }

  return (
    <>
      <Button
        size='small'
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleShowMenu}
      >
        <MenuIcon color='secondary' fontSize='small' />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          <MenuItem onClick={handleRefresh}>
            <ListItemIcon>
              <CachedIcon color='secondary' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='refresh'></ListItemText>
          </MenuItem>
          <HorizontalDivider />
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <ViewList color='secondary' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='edit'></ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default StockListMenu

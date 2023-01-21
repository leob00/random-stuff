import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuIcon from '@mui/icons-material/Menu'
import { Delete } from '@mui/icons-material'

const StockListMenu = ({ id, onRemoveItem }: { id: string; onRemoveItem: (id: string) => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleRemove = () => {
    handleCloseMenu()
    onRemoveItem(id)
  }
  const handleShowCharts = () => {
    handleCloseMenu()
    //onShowCharts()
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
          <MenuItem onClick={handleRemove}>
            <ListItemIcon>
              <Delete color='secondary' fontSize='small' />
            </ListItemIcon>
            <ListItemText>remove</ListItemText>
          </MenuItem>
          {/* <Divider /> */}
        </MenuList>
      </Menu>
    </>
  )
}

export default StockListMenu

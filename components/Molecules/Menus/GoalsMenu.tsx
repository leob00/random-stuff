import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuIcon from '@mui/icons-material/Menu'

const GoalsMenu = ({ onRefresh, onShowCharts }: { onRefresh: () => void; onShowCharts: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleRefesh = () => {
    handleCloseMenu()
    onRefresh()
  }
  const handleShowCharts = () => {
    handleCloseMenu()
    onShowCharts()
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
          horizontal: 'right',
        }}
      >
        <MenuList>
          <MenuItem onClick={handleRefesh}>
            <ListItemIcon>
              <CachedIcon color='secondary' fontSize='small' />
            </ListItemIcon>
            <ListItemText>refresh</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleShowCharts}>
            <ListItemIcon>
              <BarChartIcon color='secondary' fontSize='small' />
            </ListItemIcon>
            <ListItemText>summary</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default GoalsMenu

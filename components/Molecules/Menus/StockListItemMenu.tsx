import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuIcon from '@mui/icons-material/Menu'
import { Delete } from '@mui/icons-material'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import HamburgerMenu from './HamburgerMenu'

const StockListItemMenu = ({ id, onRemoveItem }: { id: string; onRemoveItem: (id: string) => void }) => {
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
      <HamburgerMenu>
        <MenuList>
          <MenuItem onClick={handleRemove}>
            <ListItemIcon>
              <Delete color='error' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='remove' color={CasinoRedTransparent}></ListItemText>
          </MenuItem>
        </MenuList>
      </HamburgerMenu>
    </>
  )
}

export default StockListItemMenu

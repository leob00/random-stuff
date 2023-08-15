import React from 'react'
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import HamburgerMenu from './HamburgerMenu'

const StockListItemMenu = ({ id, onRemoveItem }: { id: string; onRemoveItem: (id: string) => void }) => {
  const handleRemove = () => {
    onRemoveItem(id)
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

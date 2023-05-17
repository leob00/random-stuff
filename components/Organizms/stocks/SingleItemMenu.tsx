import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Button, ListItemAvatar, ListItem, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Edit, Toc, ViewList } from '@mui/icons-material'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SortIcon from '@mui/icons-material/Sort'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { Delete, DragIndicator } from '@mui/icons-material'

const SingleItemMenu = ({ symbol, onEdelete }: { symbol: string; onEdelete: (symbol: string) => void }) => {
  return (
    <HamburgerMenu>
      <MenuList>
        <MenuItem onClick={() => onEdelete(symbol)}>
          <ListItemIcon>
            <Delete color='error' fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='remove'></ListItemText>
        </MenuItem>
      </MenuList>
    </HamburgerMenu>
  )
}

export default SingleItemMenu

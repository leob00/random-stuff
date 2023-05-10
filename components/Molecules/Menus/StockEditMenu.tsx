import React from 'react'
import { Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Button, ListItemAvatar, ListItem, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CachedIcon from '@mui/icons-material/Cached'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DropdownList from 'components/Atoms/Inputs/DropdownList'

const StockEditMenu = ({ onDelete }: { onDelete: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <DropdownList
        options={[
          { text: 'select', value: 'select' },
          { text: 'delete', value: 'delete' },
        ]}
        selectedOption={'select'}
      />
    </>
  )
}

export default StockEditMenu

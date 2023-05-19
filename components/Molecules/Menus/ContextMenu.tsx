import React, { ReactNode } from 'react'
import { Menu, Button, MenuList, MenuItem, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

export interface ContextMenuItem {
  fn: (arg?: unknown) => void
  item: JSX.Element | JSX.Element[]
}

const ContextMenu = ({ items }: { items: ContextMenuItem[] }) => {
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
      <Button
        size='small'
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
          {items.map((item, i) => (
            <MenuItem
              sx={{ py: 1 }}
              divider={true}
              key={i}
              onClick={() => {
                handleCloseMenu()
                item.fn()
              }}
            >
              {item.item}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  )
}

export default ContextMenu

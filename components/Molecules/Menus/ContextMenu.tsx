import React from 'react'
import { Menu, Button, MenuList, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { DarkMode } from 'components/themes/DarkMode'

export interface ContextMenuItem {
  fn: (arg?: unknown) => void
  item: JSX.Element[] | JSX.Element
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
      <DarkMode>
        <Menu
          //id='basic-menu'
          sx={{}}
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
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
      </DarkMode>
    </>
  )
}

export default ContextMenu

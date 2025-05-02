import { Menu, Button, MenuList, MenuItem, Typography, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { DarkMode } from 'components/themes/DarkMode'
import { useState } from 'react'
import React from 'react'

export interface ContextMenuItem {
  fn: (arg?: unknown) => void
  item: React.JSX.Element[] | React.JSX.Element
}

const ContextMenu = ({ items }: { items: ContextMenuItem[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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
        <MenuIcon color='primary' fontSize='small' />
      </Button>
      <DarkMode>
        <Menu
          id='basic-menu'
          sx={{}}
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          slotProps={{
            root: {
              'aria-labelledby': 'basic-button',
            },
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

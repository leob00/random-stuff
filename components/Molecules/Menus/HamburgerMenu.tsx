import React, { ReactNode } from 'react'
import { Menu, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const HamburgerMenu = ({ children }: { children: ReactNode }) => {
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
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleShowMenu}
      >
        <MenuIcon color='secondary' fontSize='small' />
      </Button>
      <Menu
        //id='basic-menu'
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
        {children}
      </Menu>
    </>
  )
}

export default HamburgerMenu
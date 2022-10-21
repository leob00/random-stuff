import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Person } from '@mui/icons-material'
import router from 'next/router'
import { Box, Stack, Typography } from '@mui/material'
import { VeryLightBlue } from './themes/mainTheme'
import { Divider } from '@aws-amplify/ui-react'

const LoggedInUserMenu = ({ username, onLogOut }: { username: string; onLogOut: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    onLogOut()
  }

  return (
    <>
      <Stack sx={{ display: 'flex' }} flexDirection='row'>
        {/* <Typography variant='body2' sx={{ paddingTop: 1 }}>{`${username.substring(0, username.lastIndexOf('@'))}`}</Typography> */}
        <Button
          sx={{ display: 'flex' }}
          id='basic-button'
          variant='text'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Person />
        </Button>
      </Stack>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          sx={{ color: VeryLightBlue }}
          onClick={() => {
            handleClose()
            router.push('/protected/csr')
          }}
        >
          profile
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: VeryLightBlue }} onClick={handleLogout}>
          sign out
        </MenuItem>
      </Menu>
    </>
  )
}
export default LoggedInUserMenu

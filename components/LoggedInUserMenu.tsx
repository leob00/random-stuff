import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Person } from '@mui/icons-material'
import router from 'next/router'
import { Box, Stack, Typography } from '@mui/material'
import { VeryLightBlue } from './themes/mainTheme'
import { Divider } from '@aws-amplify/ui-react'
import HorizontalDivider from './Atoms/Dividers/HorizontalDivider'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'

const LoggedInUserMenu = ({ username, onLogOut }: { username: string; onLogOut: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)
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
  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      if (user) {
        setIsAdmin(userHasRole('Admin', user.roles))
      }
    }
    fn()
  }, [])

  return (
    <>
      <Button
        size='small'
        //sx={{ display: 'flex' }}
        id='basic-button'
        variant='text'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Person fontSize='small' />
      </Button>

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
            router.push('/protected/csr/dashboard')
          }}
        >
          dashboard
        </MenuItem>

        <HorizontalDivider />
        <MenuItem
          sx={{ color: VeryLightBlue }}
          onClick={() => {
            handleClose()
            router.push('/protected/csr/profile')
          }}
        >
          profile
        </MenuItem>
        <HorizontalDivider />
        {isAdmin && (
          <Box>
            <MenuItem
              sx={{ color: VeryLightBlue }}
              onClick={() => {
                handleClose()
                router.push('/protected/csr/admin')
              }}
            >
              admin
            </MenuItem>
            <HorizontalDivider />
          </Box>
        )}

        <MenuItem sx={{ color: VeryLightBlue }} onClick={handleLogout}>
          log off
        </MenuItem>
      </Menu>
    </>
  )
}
export default LoggedInUserMenu

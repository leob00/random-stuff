import * as React from 'react'
import Person from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/navigation'
import { ListItemIcon, ListItemText } from '@mui/material'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import ContextMenu, { ContextMenuItem } from './Molecules/Menus/ContextMenu'

const LoggedInUserMenu = ({ onLogOut }: { onLogOut: () => void }) => {
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()

  const handleLogout = () => {
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

  const menu: ContextMenuItem[] = [
    {
      item: <ListItemText primary='dashboard'></ListItemText>,
      fn: () => {
        router.push('/protected/csr/dashboard')
      },
    },
    {
      item: <ListItemText primary='profile'></ListItemText>,
      fn: () => {
        router.push('/protected/csr/profile')
      },
    },
  ]
  if (isAdmin) {
    menu.push({
      item: <ListItemText primary='admin'></ListItemText>,
      fn: () => {
        router.push('/protected/csr/admin')
      },
    })
  }
  menu.push({
    item: (
      <>
        <ListItemIcon>
          <LogoutIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText primary='log off'></ListItemText>
      </>
    ),
    fn: () => onLogOut(),
  })

  return (
    <>
      <ContextMenu items={menu} />
      {/* <Button
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
      </Menu> */}
    </>
  )
}
export default LoggedInUserMenu

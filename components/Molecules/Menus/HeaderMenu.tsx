'use client'
import { IconButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { useRouter } from 'next/router'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const HeaderMenu = ({
  ticket,
  palette,
  onLogOutClick,
  onChangePalette,
}: {
  ticket: AmplifyUser | null
  palette: 'light' | 'dark'
  onLogOutClick: () => void
  onChangePalette: () => void
}) => {
  const router = useRouter()
  const paletteMenuItem: ContextMenuItem = {
    item: (
      <>
        {palette === 'light' ? (
          <>
            <ListItemIcon>
              <DarkModeIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='dark mode'></ListItemText>
          </>
        ) : (
          <>
            <ListItemIcon>
              <LightModeIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='light mode'></ListItemText>
          </>
        )}
      </>
    ),
    fn: () => {
      onChangePalette()
    },
  }
  const loggedInMenu: ContextMenuItem[] = [
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
  const menuItems: ContextMenuItem[] = []

  if (ticket) {
    menuItems.push(...loggedInMenu)
    const isAdmin = userHasRole('Admin', ticket.roles)
    if (isAdmin) {
      menuItems.push({
        item: <ListItemText primary='admin'></ListItemText>,
        fn: () => {
          router.push('/protected/csr/admin')
        },
      })
    }
    menuItems.push(paletteMenuItem)
    menuItems.push({
      item: (
        <>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='log off'></ListItemText>
        </>
      ),
      fn: () => onLogOutClick(),
    })
  } else {
    menuItems.push(paletteMenuItem)
    menuItems.push({
      item: (
        <>
          <ListItemIcon>
            <LoginIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='log in'></ListItemText>
        </>
      ),
      fn: () => router.push('/login'),
    })
  }

  return <ContextMenu items={menuItems} />
}

export default HeaderMenu

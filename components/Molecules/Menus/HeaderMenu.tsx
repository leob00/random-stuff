'use client'
import { ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import { useRouter } from 'next/navigation'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ContextMenuSignIn from './ContextMenuSignIn'
import ContextMenuSignOut from './ContextMenuSignOut'
import ContextMenuPortfolio from './ContextMenuPortfolio'
import ContextMenuDashboard from './ContextMenuDashboard'

const HeaderMenu = ({
  ticket,
  palette,
  onLogOutClick,
  onChangePalette,
}: {
  ticket: AmplifyUser | null
  palette: 'light' | 'dark'
  onLogOutClick: () => void
  onChangePalette: (palette: 'light' | 'dark') => void
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
      onChangePalette(palette === 'dark' ? 'light' : 'dark')
    },
  }
  const loggedInMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuDashboard text='dashboard' />,
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
      item: <ContextMenuSignOut />,
      fn: () => onLogOutClick(),
    })
  } else {
    menuItems.push({
      item: <ContextMenuPortfolio text='dashboard' />,
      fn: () => {
        router.push('/protected/csr/dashboard')
      },
    })
    menuItems.push(paletteMenuItem)

    menuItems.push({
      item: <ContextMenuSignIn />,
      fn: () => router.push('/login'),
    })
  }

  return <ContextMenu items={menuItems} />
}

export default HeaderMenu

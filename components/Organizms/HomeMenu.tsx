'use client'
import { Box, Button } from '@mui/material'
import React from 'react'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { siteMap } from './navigation/siteMap'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouteTracker } from './session/useRouteTracker'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { useUserController } from 'hooks/userController'
import { userHasRole } from 'lib/backend/auth/userUtil'

const HomeMenu = () => {
  const { allRoutes: recentRoutes } = useRouteTracker()
  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const all = siteMap()
  const [showGroupedMenu, setShowGroupedMenu] = React.useState(recentHistory.length < 4)
  const { ticket } = useUserController()
  const isAdmin = userHasRole('Admin', ticket?.roles ?? [])

  const adminCategories = isAdmin ? all.filter((m) => m.category === 'Admin') : []
  const pathCategories = all.filter((m) => m.category !== 'Admin')

  return (
    <Box>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
        }}>
        <CenteredHeader title={'Welcome to random stuff'} description={'You came to the right place to view random things. Enjoy!'} />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button size='small' aria-haspopup='true' onClick={() => setShowGroupedMenu(!showGroupedMenu)}>
            <MenuIcon color='primary' fontSize='small' />
          </Button>
        </Box>
        <Box pb={8}>
          <Box py={2}>
            {showGroupedMenu && (
              <>
                <GroupedHomeMenu pathCategories={pathCategories} />
                <>{isAdmin && <GroupedHomeMenu pathCategories={adminCategories} />}</>
              </>
            )}
            {!showGroupedMenu && (
              <>
                <CenteredTitle title={'Recent History'} variant='h4' />
                {recentHistory.map((item, i) => (
                  <Box key={item.path}>
                    <CenteredNavigationButton route={item.path} text={item.name} />
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomeMenu

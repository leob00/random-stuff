'use client'
import { Box, Button } from '@mui/material'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouteTracker } from './session/useRouteTracker'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'
import { useUserController } from 'hooks/userController'
import { userHasRole } from 'lib/backend/auth/userUtil'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useEffect, useState } from 'react'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { flatSiteMap } from './navigation/siteMap'

const HomeMenu = () => {
  const { allRoutes: recentRoutes } = useRouteTracker()
  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const all = [...flatSiteMap]
  const [showDefaultMenu, setShowDefaultMenu] = useState(recentHistory.length < 4)
  const { ticket } = useUserController()
  const isAdmin = userHasRole('Admin', ticket?.roles ?? [])

  const adminCategories = isAdmin ? all.filter((m) => m.category === 'Admin') : []
  const allPaths = all.filter((m) => m.category !== 'Admin' && m.category !== 'Home')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Box>
      {!isLoading && (
        <Box
          sx={{
            mt: 4,
            borderTopWidth: 3,
          }}
        >
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button size='small' aria-haspopup='true' onClick={() => setShowDefaultMenu(!showDefaultMenu)}>
              <MenuIcon color='primary' fontSize='small' />
            </Button>
          </Box>
          <Box pb={8}>
            <Box py={2}>
              {showDefaultMenu && (
                <ScrollableBox maxHeight={700}>
                  <GroupedHomeMenu recentRoutes={recentHistory} isAdmin={isAdmin} />
                </ScrollableBox>
              )}
              {!showDefaultMenu && (
                <>
                  <CenteredTitle title={'Recent History'} variant='h4' />
                  {recentHistory.map((item, i) => (
                    <Box key={item.path}>
                      <Box display={'flex'} justifyContent={'center'} py={2}>
                        <FadeIn>
                          <NavigationButton path={item.path} name={item.name} category={item.category} variant='h6' />
                        </FadeIn>
                      </Box>
                      <HorizontalDivider />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomeMenu

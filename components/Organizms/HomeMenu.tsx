import { Box, Button, Card, CardContent, Paper, Stack } from '@mui/material'
import React from 'react'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { useUserController } from 'hooks/userController'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { siteMap } from './navigation/siteMap'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouteTracker } from './session/useRouteTracker'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'

const HomeMenu = () => {
  const { routes: recentRoutes, loading } = useRouteTracker()

  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const pathCategories = siteMap()
  const [showGroupedMenu, setShowGroupedMenu] = React.useState(recentHistory.length === 0)

  return (
    <Box>
      {loading && <BackdropLoader />}
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
        }}
      >
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
              </>
            )}
            {!showGroupedMenu && (
              <>
                <CenteredTitle title={'Recent History'} variant='h4' />
                {recentHistory.map((item, i) => (
                  <Box key={item.path} py={1}>
                    <Card>
                      <CardContent>
                        <Box display={'flex'} justifyContent={'center'}>
                          <NavigationButton route={item.path} text={item.name} />
                        </Box>
                      </CardContent>
                    </Card>
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

import { Box } from '@mui/material'
import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'
import { useRouteTracker } from '../session/useRouteTracker'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const UserDashboardLayout = ({ ticket }: { ticket: AmplifyUser | null }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  let isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)
  const recentRoutes = useRouteTracker().routes.filter((m) => m.name !== 'dashboard')

  React.useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <>
      <Box sx={{ my: 2 }}>
        <>
          {recentRoutes.length > 0 && (
            <Box pb={4}>
              <CenteredTitle title={'Recent'} variant={'h5'} />
              <Box>
                {recentRoutes.map((item, i) => (
                  <Box key={item.path}>
                    <CenteredNavigationButton route={item.path} text={item.name} showDivider={i < recentRoutes.length - 1} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Box pt={4}>
            {recentRoutes.length > 0 && <CenteredTitle title={'All'} variant={'h5'} />}
            <CenteredNavigationButton route={'/csr/news'} text={'news'} />
            <CenteredTitle title='Stocks' />
            <CenterStack sx={{ pt: 2, gap: 2 }}>
              <NavigationButton route={'/csr/stocks'} text={'my list'} />
              <NavigationButton route={'/csr/stocks/stock-porfolios'} text={'portfolio'} />
            </CenterStack>
            <CenteredNavigationButton route={'/ssg/community-stocks'} text={'community'} showDivider={false} />
            <HorizontalDivider />
            <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
            <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
            <CenteredNavigationButton route={'/ssg/recipes'} text={'recipes'} />
            <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} showDivider={isAdmin} />
            {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} />}
            {isAdmin && <CenteredNavigationButton route={'/protected/csr/sandbox'} text={'sandbox'} showDivider={false} />}
          </Box>
        </>
      </Box>
    </>
  )
}

export default UserDashboardLayout

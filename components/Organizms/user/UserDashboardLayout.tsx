import { Box } from '@mui/material'
import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'
import { useRouteTracker } from '../session/useRouteTracker'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
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
              <CenteredHeader title={'Recent'} />
              {recentRoutes.map((item, i) => (
                <CenteredNavigationButton key={item.path} route={item.path} text={item.name} showDivider={recentRoutes.length < 1} />
              ))}
            </Box>
          )}
          <>
            {recentRoutes.length > 0 && <CenteredHeader title={'All'} />}
            <CenteredNavigationButton route={'/csr/news'} text={'news'} />
            <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
            <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
            <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
            <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} showDivider={isAdmin} />
            {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} />}
            {isAdmin && <CenteredNavigationButton route={'/protected/csr/sandbox'} text={'sandbox'} showDivider={false} />}
          </>
        </>
      </Box>
    </>
  )
}

export default UserDashboardLayout

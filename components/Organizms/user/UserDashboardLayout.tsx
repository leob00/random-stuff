import { Box, Paper } from '@mui/material'
import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'
import { useRouteTracker } from '../session/useRouteTracker'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { useRouter } from 'next/navigation'

const UserDashboardLayout = ({ ticket }: { ticket: AmplifyUser | null }) => {
  const router = useRouter()
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
              <CenteredTitle title={'Recent'} variant={'h4'} />
              <Paper>
                {recentRoutes.map((item, i) => (
                  <Box key={item.path}>
                    <CenteredNavigationButton route={item.path} text={item.name} />
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
          <Box pt={4}>
            {recentRoutes.length > 0 && <CenteredTitle title={'All'} variant={'h4'} />}
            <Paper>
              <CenteredNavigationButton route={'/csr/news'} text={'news'} />
              <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
              <CenteredNavigationButton route={'/csr/stocks/stock-porfolios'} text={'stock portfolios'} />
              <CenteredNavigationButton route={'/ssg/community-stocks'} text={'community stocks'} />
              <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
              <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
              <CenteredNavigationButton route={'/ssg/recipes'} text={'recipes'} />
              <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} />
              {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} />}
              {isAdmin && <CenteredNavigationButton route={'/protected/csr/sandbox'} text={'sandbox'} />}
            </Paper>
          </Box>
        </>
      </Box>
    </>
  )
}

export default UserDashboardLayout

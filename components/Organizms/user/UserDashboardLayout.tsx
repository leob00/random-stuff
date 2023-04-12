import { Box } from '@mui/material'
import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'
import { AmplifyUser, userHasRole } from 'lib/backend/auth/userUtil'

const UserDashboardLayout = ({ ticket }: { ticket: AmplifyUser | null }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  let isAdmin = ticket !== null && userHasRole('Admin', ticket.roles)

  React.useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <>
      <Box sx={{ my: 2 }}>
        <>
          <CenteredNavigationButton route={'/csr/news'} text={'news'} />
          <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
          <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
          <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
          <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} showDivider={isAdmin} />
          {isAdmin && <CenteredNavigationButton route={'/protected/csr/admin'} text={'admin'} showDivider={false} />}
        </>
      </Box>
    </>
  )
}

export default UserDashboardLayout

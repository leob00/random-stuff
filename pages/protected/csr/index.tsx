import { Box, Container } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Protected = () => {
  const [authUser, setAuthUser] = React.useState<AmplifyUser | null>(null)
  const [firstLoad, setFirstLoad] = React.useState(true)
  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      if (user) {
        setAuthUser(user)
      }
      setFirstLoad(false)
    }
    fn()
  }, [])

  return (
    <>
      <Container>
        {!authUser ? (
          !firstLoad ? (
            <PleaseLogin />
          ) : (
            <></>
          )
        ) : (
          authUser.email && (
            <Box sx={{ py: 2 }}>
              <CenteredHeader title={`Welcome back, ${authUser.email.substring(0, authUser.email.indexOf('@'))}!`} description={'what would you like to do?'} />
              <UserDashboardLayout username={authUser.email} />
            </Box>
          )
        )}
      </Container>
    </>
  )
}

export default Protected

import { Box, Container } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Page = () => {
  //const [authUser, setAuthUser] = React.useState<AmplifyUser | null>(null)
  const [firstLoad, setFirstLoad] = React.useState(true)

  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const userController = useUserController()

  React.useEffect(() => {
    const fn = async () => {
      if (firstLoad) {
        const profile = await userController.refetchProfile(300)
        setUserProfile(profile)
      }
      setFirstLoad(false)
    }
    fn()
  }, [firstLoad])

  return (
    <>
      <Container>
        {!userProfile ? (
          !firstLoad ? (
            <PleaseLogin />
          ) : (
            <></>
          )
        ) : (
          <>
            <CenteredHeader title={`Welcome back, ${userProfile.username.substring(0, userProfile.username.indexOf('@'))}!`} description={''} />
            <UserDashboardLayout username={userProfile.username} />
          </>
        )}
      </Container>
    </>
  )
}

export default Page

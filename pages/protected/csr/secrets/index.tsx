import { Box } from '@mui/material'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import SecretsLayout from 'components/Organizms/user/secrets/SecretsLayout'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [ticket, setTicket] = React.useState<AmplifyUser | null>(null)

  React.useEffect(() => {
    const fn = async () => {
      const user = await getUserCSR()
      setTicket(user)
      const p = await userController.refetchProfile()
      if (!p) {
        console.log('unable to load profile')
      }
      setUserProfile(p)
      setLoading(false)
    }
    fn()
  }, [userController.username])

  return (
    <>
      <NonSSRWrapper>
        {loading ? (
          <WarmupBox />
        ) : userProfile && ticket ? (
          <>
            <CenteredTitle title='Secrets Manager' />
            <Box py={2}>
              <SecretsLayout profile={userProfile} user={ticket} />
            </Box>
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page

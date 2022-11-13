import { Box, Container } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenteredParagraph from 'components/Atoms/Containers/CenteredParagraph'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import RequireUserProfile from 'components/Organizms/RequireUserProfile'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)

  React.useEffect(() => {
    const fn = async () => {
      const p = await userController.refetchProfile(300)
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
        ) : userProfile ? (
          <>
            <CenteredTitle title='Dashboard' />
            <UserDashboardLayout userProfile={userProfile} />
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page

import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const userProfile = userController.authProfile
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      const p = await userController.refetchProfile(300)
      if (!p) {
        console.log('unable to load profile')
      }
      userController.setProfile(p)
      setLoading(false)
    }
    fn()
  }, [userController.username])

  return (
    <ResponsiveContainer>
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
    </ResponsiveContainer>
  )
}

export default Page

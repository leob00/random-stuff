import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      if (!userProfile) {
        const p = await userController.fetchProfilePassive()
        setUserProfile(p)
      }
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile])

  return (
    <ResponsiveContainer>
      <PageHeader text={'Goals'} backButtonRoute={'/protected/csr/dashboard'} />
      {isLoading ? <WarmupBox /> : <>{userProfile ? <UserGoalsLayout username={userProfile.username} /> : <PleaseLogin />}</>}
    </ResponsiveContainer>
  )
}

export default Page

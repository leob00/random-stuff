import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'

const Notes = () => {
  const userController = useUserController()
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let fn = async () => {
      const p = await userController.fetchProfilePassive(900)
      setUserProfile(p)
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.username])
  return (
    <>
      <Seo pageTitle='Notes' />
      <ResponsiveContainer>
        {isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            {!userProfile ? (
              <PleaseLogin />
            ) : (
              <>
                <UserNotesLayout userProfile={userProfile} />
              </>
            )}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Notes

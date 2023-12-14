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
  //const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [isLoading, setIsLoading] = React.useState(true)
  const { authProfile, setProfile } = useUserController()

  React.useEffect(() => {
    let fn = async () => {
      if (!authProfile) {
        const p = await userController.fetchProfilePassive()
        setProfile(p)
      }
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])
  return (
    <>
      <Seo pageTitle='Notes' />
      <ResponsiveContainer>
        {isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            {!authProfile ? (
              <PleaseLogin />
            ) : (
              <>
                <UserNotesLayout userProfile={authProfile} />
              </>
            )}
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Notes

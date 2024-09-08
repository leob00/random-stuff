import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfileAuth, UserProfileContext } from 'lib/ui/auth/UserProfileContext'
import { ReactNode, useState, useEffect } from 'react'
import RequireUserProfileWrapper from './RequireUserProfileWrapper'

const RequireUserProfile = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { authProfile, setProfile, getProfile } = useUserController()
  const [isLoading, setIsLoading] = useState(true)
  const defaultState: UserProfileAuth = { userProfile: authProfile }

  useEffect(() => {
    let fn = async () => {
      if (!authProfile) {
        if (isLoading) {
          const p = await getProfile()
          setProfile(p)
          //setProfileState(p)
          //defaultState.setUserProfile(p)
        }
      }
      if (isLoading) {
        setIsLoading(false)
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile, isLoading])

  return (
    <>
      {isLoading && <BackdropLoader />}
      <>
        {!isLoading && !authProfile ? (
          <PleaseLogin />
        ) : (
          <>
            <UserProfileContext.Provider value={defaultState}>
              <RequireUserProfileWrapper>{children}</RequireUserProfileWrapper>
            </UserProfileContext.Provider>
          </>
        )}
      </>
    </>
  )
}

export default RequireUserProfile

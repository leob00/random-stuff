import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfileAuth, UserProfileContext } from 'lib/ui/auth/UserProfileContext'
import React, { ReactNode } from 'react'
import RequireUserProfileWrapper from './RequireUserProfileWrapper'

const RequireUserProfile = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { authProfile, setProfile, fetchProfilePassive } = useUserController()
  const [isLoading, setIsLoading] = React.useState(true)
  const [profileState, setProfileState] = React.useState(authProfile)
  const defaultState: UserProfileAuth = { userProfile: profileState, setUserProfile: setProfileState }

  React.useEffect(() => {
    let fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
        setProfileState(p)
        defaultState.setUserProfile(p)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile, profileState])

  return (
    <>
      {isLoading && <BackdropLoader />}
      <>
        {!isLoading && !profileState ? (
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

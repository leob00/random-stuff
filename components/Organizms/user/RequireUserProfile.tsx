import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { UserProfileAuth, UserProfileContext } from 'lib/ui/auth/UserProfileContext'
import { ReactNode } from 'react'
import RequireUserProfileWrapper from './RequireUserProfileWrapper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const RequireUserProfile = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const defaultState: UserProfileAuth = { userProfile: userProfile }

  return (
    <>
      {isValidatingProfile && <BackdropLoader />}
      <>
        {!isValidatingProfile && !userProfile ? (
          <PleaseLogin />
        ) : (
          <>
            {!isValidatingProfile && (
              <UserProfileContext.Provider value={defaultState}>
                <RequireUserProfileWrapper>{children}</RequireUserProfileWrapper>
              </UserProfileContext.Provider>
            )}
          </>
        )}
      </>
    </>
  )
}

export default RequireUserProfile

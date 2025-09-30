import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const Page = () => {
  const { userProfile, isValidating } = useProfileValidator()

  return (
    <>
      <>
        {isValidating && <BackdropLoader />}
        {userProfile && !isValidating ? <ProfileLayout userProfile={userProfile} /> : <PleaseLogin />}
      </>
    </>
  )
}

export default Page

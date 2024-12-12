import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const Page = () => {
  const { userProfile, isValidating } = useProfileValidator()

  return (
    <>
      <>
        {isValidating && <BackdropLoader />}
        {userProfile && <ProfileLayout userProfile={userProfile} />}
      </>
    </>
  )
}

export default Page

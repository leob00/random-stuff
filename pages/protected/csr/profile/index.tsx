import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const { authProfile, setProfile, fetchProfilePassive } = useUserController()
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
        setIsLoading(false)
      }
    }

    fn()
  }, [authProfile])
  return (
    <>
      <>
        {isLoading && <BackdropLoader />}
        {authProfile && <ProfileLayout userProfile={authProfile} />}
      </>
    </>
  )
}

export default Page

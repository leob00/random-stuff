import { Container } from '@mui/material'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const RequireUserProfile = ({ profile, children }: { profile: UserProfile | null; children: React.ReactNode }) => {
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(profile)
  const userController = useUserController()

  React.useEffect(() => {
    const fn = async () => {
      if (firstLoad) {
        let profile = await userController.refetchProfile(300)
        setUserProfile(profile)
      }
      setFirstLoad(false)
    }
    fn()
  }, [])
  return (
    <>
      {!userProfile}
      <Container>{!userProfile ? !firstLoad ? <PleaseLogin /> : <WarmupBox /> : <>{children}</>}</Container>
      {children}
    </>
  )
}

export default RequireUserProfile

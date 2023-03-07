import { Alert, Snackbar, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import ReEnterPassword from 'components/Organizms/Login/ReEnterPassword'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)

  React.useEffect(() => {
    const fn = async () => {
      const p = await userController.refetchProfile(300)
      setUserProfile(p)
      setLoading(false)
    }
    fn()
  }, [userController.username])

  return (
    <>
      <NonSSRWrapper>
        {loading ? (
          <WarmupBox />
        ) : userProfile ? (
          <>
            <ProfileLayout profile={userProfile} />
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page

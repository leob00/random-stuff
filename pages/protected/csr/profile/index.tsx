import { Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import ReEnterPassword from 'components/Organizms/Login/ReEnterPassword'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [showPasswordEntry, setShowPasswordEntry] = React.useState(false)

  const handleChangePinClick = () => {
    setShowPasswordEntry(true)
  }

  const handlePasswordValidated = () => {
    setShowPasswordEntry(false)
  }
  const handleCancelChangePin = () => {
    setShowPasswordEntry(false)
  }
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
            <CenteredHeader title={`Profile`} />
            <HorizontalDivider />
            <CenterStack>
              <Typography variant='body1'>
                <LinkButton onClick={handleChangePinClick}>change pin</LinkButton>
              </Typography>
            </CenterStack>
            <ReEnterPasswordDialog
              show={showPasswordEntry}
              title='Login'
              text='Please enter your password so you can reset your pin.'
              userProfile={userProfile}
              onConfirm={handlePasswordValidated}
              onCancel={handleCancelChangePin}
            />
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page

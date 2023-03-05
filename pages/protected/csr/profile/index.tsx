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
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [showPasswordEntry, setShowPasswordEntry] = React.useState(false)
  const [showPinEntry, setShowPinEntry] = React.useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = React.useState(false)

  const handleChangePinClick = () => {
    setShowPasswordEntry(true)
  }

  const handlePasswordValidated = () => {
    setShowPasswordEntry(false)
    setShowPinEntry(true)
  }
  const handleCancelChangePin = async () => {
    setShowPasswordEntry(false)
    setShowPinEntry(false)
  }
  const handlePinChanged = async (pin: UserPin) => {
    const p = userController.authProfile!
    p.pin = pin
    userController.setProfile(p)
    setUserProfile(p)
    await handleCancelChangePin()
    setShowPinChangedMessage(true)
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
            <Snackbar
              open={showPinChangedMessage}
              autoHideDuration={3000}
              onClose={() => setShowPinChangedMessage(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={() => setShowPinChangedMessage(false)} severity='success' sx={{ width: '100%' }}>
                Your pin has been updated!
              </Alert>
            </Snackbar>
            <CenteredHeader title={`Profile`} />
            <HorizontalDivider />
            <CenterStack>
              <Typography variant='body1'>
                <LinkButton onClick={handleChangePinClick}>{`${userProfile.pin ? 'reset pin' : 'create pin'}`}</LinkButton>
              </Typography>
            </CenterStack>
            <ReEnterPasswordDialog
              show={showPasswordEntry}
              title='Login'
              text='Please enter your password so you can set your pin.'
              userProfile={userProfile}
              onConfirm={handlePasswordValidated}
              onCancel={handleCancelChangePin}
            />
            <CreatePinDialog show={showPinEntry} userProfile={userProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page

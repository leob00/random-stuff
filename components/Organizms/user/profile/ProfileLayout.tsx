import { Alert, Snackbar, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const ProfileLayout = ({ profile }: { profile: UserProfile }) => {
  const [showPasswordEntry, setShowPasswordEntry] = React.useState(false)
  const [showPinEntry, setShowPinEntry] = React.useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState<UserProfile>(profile)

  const userController = useUserController()
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
    setShowPinChangedMessage(true)
    setShowPinEntry(false)
  }
  return (
    <>
      <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} />
      <CenteredHeader title={`Profile`} />
      <HorizontalDivider />
      <CenterStack>
        <Typography variant='body1'>
          {!showPasswordEntry && !showPinEntry && (
            <LinkButton onClick={handleChangePinClick}>
              <Typography>{`${userProfile.pin ? 'reset pin' : 'create a pin'}`}</Typography>
            </LinkButton>
          )}
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
  )
}

export default ProfileLayout

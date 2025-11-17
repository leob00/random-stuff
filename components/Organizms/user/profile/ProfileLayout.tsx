'use client'
import { Box, Typography } from '@mui/material'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import VerifyEmail from './VerifyEmail'
import ValidateFromEmailDialog from 'components/Organizms/Login/ValidateFromEmailDialog'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { useState } from 'react'
import ResetPasswordLayout from './ResetPasswordLayout'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { signOutUser } from 'lib/backend/auth/userUtil'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SignOutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/dist/client/components/navigation'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPinChange, setShowPinChange] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = useState(false)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const { setProfile } = useUserController()
  const router = useRouter()

  const handleChangePinClick = () => {
    setShowPinChange(true)
  }

  const handleVerificationCodeValidated = () => {
    setShowPinChange(false)
    setShowPinEntry(true)
  }
  const handleCancelChangePin = async () => {
    setShowPinChange(false)
    setShowPinEntry(false)
  }
  const handlePinChanged = async (pin: UserPin) => {
    const p = { ...userProfile, pin: pin }
    setProfile(p)
    setShowPinChangedMessage(true)
    setShowPinEntry(false)
  }
  const handleClosePasswordEntry = () => {
    setShowPinChange(false)
  }

  const handleCancelPasswordChange = () => {
    setShowResetPassword(false)
    setShowPinChange(false)
  }

  const handlePasswordChangeSuccess = () => {
    setShowResetPassword(false)
    setShowPinChange(false)
  }

  const handleShowSignoutWarning = () => {
    setShowSignOutDialog(true)
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {showResetPassword && <ResetPasswordLayout userProfile={userProfile} onSuccess={handlePasswordChangeSuccess} onCancel={handleCancelPasswordChange} />}
      {!showResetPassword && (
        <>
          <Box py={4}>
            {!userProfile.emailVerified ? (
              <Box>
                <VerifyEmail userProfile={userProfile} />
              </Box>
            ) : (
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <Typography width={100} variant='body2' textAlign={'right'}>
                    email:
                  </Typography>
                  <Box mt={1}>
                    <AlertWithHeader severity='success' header={`${userProfile.username}`} text='' />
                  </Box>
                </Box>
                {userProfile.pin && (
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Typography textAlign={'right'} width={100} variant='body2'>
                      pin:
                    </Typography>
                    <AlertWithHeader severity='success' header={``} text='' />
                    {!showPinChange && !showPinEntry && (
                      <>
                        <SecondaryButton size='small' text={`${userProfile.pin ? 'reset' : 'create a pin'}`} onClicked={handleChangePinClick} />
                      </>
                    )}
                  </Box>
                )}
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <Typography textAlign={'right'} width={100} variant='body2'>
                    password:
                  </Typography>
                  <AlertWithHeader severity='success' header={``} text='' />
                  <SecondaryButton size='small' text={'reset'} onClick={() => setShowResetPassword(true)} />
                </Box>
                <Box pt={12}>
                  <HorizontalDivider />
                  <Box py={2} display={'flex'} justifyContent={'flex-end'}>
                    <DangerButton size='small' text={'sign out'} onClick={handleShowSignoutWarning} endIcon={<SignOutIcon />} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          {showPinChange && <ValidateFromEmailDialog show={showPinChange} onSuccess={handleVerificationCodeValidated} onClose={handleClosePasswordEntry} />}
        </>
      )}
      <CreatePinDialog show={showPinEntry} userProfile={userProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
      <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} onClose={() => setShowPinChangedMessage(false)} />
      {showSignOutDialog && (
        <ConfirmDeleteDialog
          show={showSignOutDialog}
          title='Warning'
          text='Are you sure you want to sign out?'
          onCancel={() => setShowSignOutDialog(false)}
          onConfirm={handleSignOut}
        />
      )}
    </>
  )
}

export default ProfileLayout

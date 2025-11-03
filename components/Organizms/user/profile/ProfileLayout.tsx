'use client'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import VerifyEmail from './VerifyEmail'
import ValidateFromEmailDialog from 'components/Organizms/Login/ValidateFromEmailDialog'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { useState } from 'react'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import ResetPasswordLayout from './ResetPasswordLayout'
import WarningButton from 'components/Atoms/Buttons/WarningButton'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPinChangeEntry, setShowPinChangeEntry] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = useState(false)
  const { setProfile } = useUserController()

  const handleChangePinClick = () => {
    setShowPinChangeEntry(true)
  }

  const handleVerificationCodeValidated = () => {
    setShowPinChangeEntry(false)
    setShowPinEntry(true)
  }
  const handleCancelChangePin = async () => {
    setShowPinChangeEntry(false)
    setShowPinEntry(false)
  }
  const handlePinChanged = async (pin: UserPin) => {
    const p = { ...userProfile, pin: pin }
    setProfile(p)
    setShowPinChangedMessage(true)
    setShowPinEntry(false)
  }
  const handleClosePasswordEntry = () => {
    setShowPinChangeEntry(false)
  }

  const handleCodeVerifiedPasswordChange = () => {}

  const handlePasswordChangeSuccess = () => {}
  return (
    <>
      {showResetPassword && (
        <ResetPasswordLayout userProfile={userProfile} onSuccess={handlePasswordChangeSuccess} onCodeVerified={handleCodeVerifiedPasswordChange} />
      )}
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
                    {!showPinChangeEntry && !showPinEntry && (
                      <>
                        <SuccessButton size='small' text={`${userProfile.pin ? 'reset' : 'create a pin'}`} onClicked={handleChangePinClick} />
                      </>
                    )}
                  </Box>
                )}
                {/* <Box display={'flex'} gap={1} alignItems={'center'}>
                  <Typography textAlign={'right'} width={100} variant='body2'>
                    password:
                  </Typography>
                  <AlertWithHeader severity='success' header={``} text='' />
                  <WarningButton size='small' text={'reset'} onClick={() => setShowResetPassword(true)} />
                </Box> */}
              </Box>
            )}
          </Box>
          <CenterStack sx={{ py: 2 }}></CenterStack>
          {showPinChangeEntry && (
            <ValidateFromEmailDialog show={showPinChangeEntry} onSuccess={handleVerificationCodeValidated} onClose={handleClosePasswordEntry} />
          )}
        </>
      )}
      <CreatePinDialog show={showPinEntry} userProfile={userProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
      <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} onClose={() => setShowPinChangedMessage(false)} />
    </>
  )
}

export default ProfileLayout

'use client'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import VerifyEmail from './VerifyEmail'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import ValidateFromEmailDialog from 'components/Organizms/Login/ValidateFromEmailDialog'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { useState } from 'react'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPinChangeEntry, setShowPinChangeEntry] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = useState(false)
  const { setProfile } = useUserController()

  const handleChangePinClick = () => {
    setShowPinChangeEntry(true)
  }

  const handlePasswordValidated = () => {
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
  return (
    <>
      <>
        <Box py={4}>
          {!userProfile.emailVerified ? (
            <Box>
              <VerifyEmail userProfile={userProfile} />
            </Box>
          ) : (
            <Box py={2}>
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <Typography width={80} variant='body2' textAlign={'right'}>
                  email:
                </Typography>
                <Box mt={1}>
                  <AlertWithHeader severity='success' header={`${userProfile.username}`} text='' />
                </Box>
              </Box>
              {userProfile.pin && (
                <Box display={'flex'} gap={1} alignItems={'center'}>
                  <Typography textAlign={'right'} width={80} variant='body2'>
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
            </Box>
          )}
        </Box>
        <CenterStack sx={{ py: 2 }}></CenterStack>
        {showPinChangeEntry && <ValidateFromEmailDialog show={showPinChangeEntry} onSuccess={handlePasswordValidated} onClose={handleClosePasswordEntry} />}

        <CreatePinDialog show={showPinEntry} userProfile={userProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
      </>
      <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} onClose={() => setShowPinChangedMessage(false)} />
    </>
  )
}

export default ProfileLayout

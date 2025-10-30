'use client'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import VerifyEmail from './VerifyEmail'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEmailVerificationStatus } from './profileHelper'
import ValidateFromEmailDialog from 'components/Organizms/Login/ValidateFromEmailDialog'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { useState } from 'react'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPasswordEntry, setShowPasswordEntry] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = useState(false)
  const { setProfile } = useUserController()
  const key = constructUserProfileKey(userProfile.username)

  const fetcherFn = async () => {
    const verified = await getEmailVerificationStatus(userProfile)
    const result = { ...userProfile, emailVerified: verified }
    if (userProfile.emailVerified !== result.emailVerified) {
      setProfile(result)
      await putUserProfile(result)
    }

    return result
  }
  const { data: validatedProfile, isLoading } = useSwrHelper(key, fetcherFn, {
    revalidateOnFocus: !userProfile.emailVerified,
  })

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
    const p = { ...userProfile, pin: pin }
    setProfile(p)
    setShowPinChangedMessage(true)
    setShowPinEntry(false)
  }
  const handleClosePasswordEntry = () => {
    setShowPasswordEntry(false)
  }
  return (
    <>
      <>
        {isLoading && <BackdropLoader />}
        {validatedProfile && (
          <>
            <Box py={4}>
              {!validatedProfile.emailVerified ? (
                <Box>
                  <VerifyEmail userProfile={validatedProfile} />
                </Box>
              ) : (
                <Box py={2}>
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Typography variant='body2'>email:</Typography>
                    <Box mt={1}>
                      <AlertWithHeader severity='success' header={`${validatedProfile.username}`} text='' />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <CenterStack sx={{ py: 2 }}>
              {!showPasswordEntry && !showPinEntry && (
                <PrimaryButton text={`${validatedProfile.pin ? 'reset pin' : 'create a pin'}`} onClicked={handleChangePinClick} />
              )}
            </CenterStack>
            {showPasswordEntry && <ValidateFromEmailDialog show={showPasswordEntry} onSuccess={handlePasswordValidated} onClose={handleClosePasswordEntry} />}

            <CreatePinDialog show={showPinEntry} userProfile={validatedProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
          </>
        )}
      </>
      <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} onClose={() => setShowPinChangedMessage(false)} />
    </>
  )
}

export default ProfileLayout

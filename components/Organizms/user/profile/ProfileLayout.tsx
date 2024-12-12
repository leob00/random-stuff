import { Alert, Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import React from 'react'
import VerifyEmail from './VerifyEmail'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEmailVerificationStatus } from './profileHelper'
import ValidateFromEmailDialog from 'components/Organizms/Login/ValidateFromEmailDialog'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPasswordEntry, setShowPasswordEntry] = React.useState(false)
  const [showPinEntry, setShowPinEntry] = React.useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = React.useState(false)
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
  return (
    <>
      <>
        {isLoading && <BackdropLoader />}
        <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} onClose={() => setShowPinChangedMessage(false)} />
        <CenteredHeader title={`Profile`} />
        <HorizontalDivider />
        {validatedProfile && (
          <>
            <Box py={4}>
              <CenterStack>Settings</CenterStack>
              {!validatedProfile.emailVerified ? (
                <VerifyEmail userProfile={validatedProfile} />
              ) : (
                <CenterStack>
                  <Box py={2}>
                    <Alert severity='success'>Email verified</Alert>
                  </Box>
                </CenterStack>
              )}
            </Box>
            <CenterStack sx={{ py: 2 }}>
              {!showPasswordEntry && !showPinEntry && (
                <PrimaryButton text={`${validatedProfile.pin ? 'reset pin' : 'create a pin'}`} onClicked={handleChangePinClick} />
              )}
            </CenterStack>
            <ValidateFromEmailDialog show={showPasswordEntry} onSuccess={handlePasswordValidated} onClose={() => setShowPasswordEntry(false)} />

            <CreatePinDialog show={showPinEntry} userProfile={validatedProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
          </>
        )}
      </>
    </>
  )
}

export default ProfileLayout

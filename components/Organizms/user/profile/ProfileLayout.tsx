import { Alert, Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import CreatePinDialog from 'components/Organizms/Login/CreatePinDialog'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'
import RequirePin from 'components/Organizms/Login/RequirePin'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import VerifyEmail from './VerifyEmail'
import useSWR, { mutate } from 'swr'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { get } from 'lib/backend/api/fetchFunctions'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const ProfileLayout = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showPasswordEntry, setShowPasswordEntry] = React.useState(false)
  const [showPinEntry, setShowPinEntry] = React.useState(false)
  const [showPinChangedMessage, setShowPinChangedMessage] = React.useState(false)
  const { setProfile } = useUserController()
  const key = constructUserProfileKey(userProfile.username)
  const emailVerified = userProfile.emailVerified ?? false

  const fetcherFn = async (_url: string, _key: string) => {
    const response: { VerificationAttributes: any } = await get('/api/ses')

    const result = { ...userProfile, emailVerified: response.VerificationAttributes[userProfile.username]['VerificationStatus'] === 'Success' }
    if (userProfile.emailVerified !== result.emailVerified) {
      setProfile(result)
      await putUserProfile(result)
    }

    return result
  }
  const { data: validatedProfile, isLoading, isValidating } = useSWR(key, ([url, key]) => fetcherFn(url, key), { revalidateOnFocus: !emailVerified, revalidateIfStale: !emailVerified, revalidateOnReconnect: !emailVerified })

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
        {isValidating && <BackdropLoader />}
        <SnackbarSuccess show={showPinChangedMessage} text={'Your pin has been updated!'} />
        <CenteredHeader title={`Profile`} />
        <HorizontalDivider />
        {validatedProfile && (
          <>
            <CenterStack>
              <Typography variant='body1'>
                {!showPasswordEntry && !showPinEntry && (
                  <LinkButton onClick={handleChangePinClick}>
                    <Typography>{`${validatedProfile.pin ? 'reset pin' : 'create a pin'}`}</Typography>
                  </LinkButton>
                )}
              </Typography>
            </CenterStack>
            <ReEnterPasswordDialog show={showPasswordEntry} title='Login' text='Please enter your password so you can set your pin.' userProfile={validatedProfile} onConfirm={handlePasswordValidated} onCancel={handleCancelChangePin} />
            <CreatePinDialog show={showPinEntry} userProfile={validatedProfile} onCancel={handleCancelChangePin} onConfirm={handlePinChanged} />
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
          </>
        )}
      </>
    </>
  )
}

export default ProfileLayout

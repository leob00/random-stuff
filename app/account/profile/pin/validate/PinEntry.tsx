'use client'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import EnterPinDialog from 'components/Organizms/Login/EnterPinDialog'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useUserController } from 'hooks/userController'
import { UserPin } from 'lib/backend/api/aws/models/apiGatewayModels'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PinEntry = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const { setProfile } = useUserController()
  const [showPinEntry, setShowPinEntry] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePinValidated = async (pin: UserPin) => {
    if (userProfile) {
      setIsLoading(true)
      const newProfile = { ...userProfile, pin: pin }
      setProfile(newProfile)
      await putUserProfile(newProfile)
      setIsLoading(false)
      router.push('/personal/secrets')
    }
  }

  return (
    <Box>
      {isLoading && <ComponentLoader />}
      {!isValidatingProfile && (
        <>
          {!userProfile && <PleaseLogin />}
          {userProfile && (
            <>
              <EnterPinDialog show={showPinEntry} userProfile={userProfile} onCancel={() => setShowPinEntry(false)} onConfirm={handlePinValidated} />
              <Box p={2} border={`1px solid ${CasinoGrayTransparent}`} borderRadius={2}>
                <CenteredHeader title='Pin required' description='please enter your pin to proceed.' />
                <CenterStack>
                  <PrimaryButton text='enter pin' onClick={() => setShowPinEntry(true)} />
                </CenterStack>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default PinEntry

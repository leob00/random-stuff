import { Alert, Box, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { postBody } from 'lib/backend/api/fetchFunctions'
import { useState } from 'react'

const VerifyEmail = ({ userProfile }: { userProfile: UserProfile }) => {
  const [instructions, setInstructions] = useState<string>('Please click the Verify button and check your email to complete verification.')
  const [isLoading, setIsLoading] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const handleVerifyEmail = async () => {
    setIsLoading(true)
    setInstructions('Please go to your email and find the instructions on how to proceed.')
    await postBody('/api/aws/ses/sendVerificationEmail', 'POST', userProfile.username)
    setIsLoading(false)
    setShowButton(false)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <CenterStack>
        <Box py={2}>
          <Alert severity='error'>Please verify your email address</Alert>
        </Box>
      </CenterStack>
      <CenterStack>
        <Typography p={2}>{instructions}</Typography>
      </CenterStack>
      <CenterStack>
        {showButton && (
          <Box py={2}>
            <PrimaryButton text='Verify' onClick={handleVerifyEmail} />
          </Box>
        )}
      </CenterStack>
    </>
  )
}

export default VerifyEmail

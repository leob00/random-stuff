import { Alert, Box, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { postBody } from 'lib/backend/api/fetchFunctions'
import React from 'react'

const VerifyEmail = ({ userProfile }: { userProfile: UserProfile }) => {
  const [instructions, setInstructions] = React.useState<string>('Please click the Verify button and check your email to complete verification.')
  const [isLoading, setIsLoading] = React.useState(false)
  const handleVerifyEmail = async () => {
    setIsLoading(true)
    setInstructions('Please go to your email and find the instructions on how to proceed.')
    await postBody('/api/ses', 'PUT', { key: userProfile.username })
    setIsLoading(false)
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
        <Box py={2}>
          <PrimaryButton text='Verify' onClick={handleVerifyEmail} />
        </Box>
      </CenterStack>
    </>
  )
}

export default VerifyEmail

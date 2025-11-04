'use client'
import { Box, Typography } from '@mui/material'
import { resetPassword } from 'aws-amplify/auth'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { VeryLightBlue } from 'components/themes/mainTheme'
import { getUserCSR, sendEmailVerificationCode } from 'lib/backend/auth/userUtil'
import { useState } from 'react'

type ServerError = {
  message: string
}

const SendEmailVerificationCode = ({ onSent, onCancel, passwordReset = false }: { onSent: () => void; onCancel: () => void; passwordReset?: boolean }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleSendVerificationConde = async () => {
    setIsLoading(true)
    setError(null)
    if (passwordReset) {
      const user = await getUserCSR()
      if (user) {
        try {
          const output = await resetPassword({ username: user.email })
          onSent()
        } catch (error) {
          const err = error as ServerError
          //console.error('Error initiating password reset:', error)
          setError(err.message)
        }
      }
    } else {
      const result = await sendEmailVerificationCode()
      if (result) {
        onSent()
      }
    }
    setIsLoading(false)
  }
  return (
    <Box py={2} border={`solid 1px ${VeryLightBlue}`} borderRadius={'16px'} minHeight={500}>
      {isLoading && <BackdropLoader />}
      <CenterStack>
        <Typography variant='h3'>Email Verification</Typography>
      </CenterStack>
      <Box py={2} px={4}>
        <Typography textAlign={'center'}>{`Please click 'send' to get an verification code to continue to the next step.`}</Typography>
      </Box>
      <CenterStack>
        <Typography variant='caption'>please look for an email from from no-reply@verificationemail.com and be sure to check your spam folders.</Typography>
      </CenterStack>
      <Box py={4}>{error && <ErrorMessage text={error} />}</Box>
      <Box py={4} display={'flex'} justifyContent={'center'} gap={2}>
        <SecondaryButton text='cancel' onClick={onCancel} />
        <SuccessButton text='send' disabled={isLoading} onClick={handleSendVerificationConde} />
      </Box>
    </Box>
  )
}

export default SendEmailVerificationCode

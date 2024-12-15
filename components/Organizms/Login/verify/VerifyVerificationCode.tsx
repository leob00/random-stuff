import { Alert, Box, TextField, Typography } from '@mui/material'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { verifyEmailVerificationCode } from 'lib/backend/auth/userUtil'
import { ChangeEventHandler, useState } from 'react'

const VerifyVerificationCode = ({ onSuccess }: { onSuccess: () => void }) => {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }
  const handleVerifyClick = async () => {
    setError(null)
    setIsLoading(true)
    const result = await verifyEmailVerificationCode(code)
    setIsVerified(result)
    setIsLoading(false)
    if (result) {
      onSuccess()
    } else {
      setError('unable to verify code')
    }
  }
  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      <Typography>Please enter your temprorary code from the email.</Typography>
      <CenterStack>
        <TextField margin='dense' size='small' placeholder='code' onChange={handleCodeChange}></TextField>
      </CenterStack>
      {error && (
        <Box>
          <CenterStack>
            <AlertWithHeader severity='error' text='unable to verify code' />
          </CenterStack>
        </Box>
      )}
      <Box py={2}>
        <CenterStack>
          {!isVerified ? (
            <SuccessButton text='verify' onClick={handleVerifyClick} disabled={isLoading} />
          ) : (
            <>
              <Typography>verified!</Typography>
            </>
          )}
        </CenterStack>
      </Box>
    </Box>
  )
}

export default VerifyVerificationCode

import { TextField, Box, Alert } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import WarmupBox from 'components/Atoms/WarmupBox'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { validateUserCSR } from 'lib/backend/auth/userUtil'
import { useState } from 'react'

const ReEnterPassword = ({ userProfile, onSuccess }: { userProfile: UserProfile; onSuccess: () => void }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const result = await validateUserCSR(userProfile?.username!, password)
    if (!result) {
      setError('failed to authenticate')
    } else {
      onSuccess()
    }
    setIsLoading(false)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }
  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <CenterStack>
          <TextField
            required
            type='password'
            variant='outlined'
            autoComplete='off'
            defaultValue={password}
            id='userPassword'
            onChange={handlePasswordChange}
            size='small'
            placeholder={''}
            InputProps={{
              autoComplete: 'off',
            }}
          ></TextField>
        </CenterStack>
        <Box height={84}>
          {error.length > 0 && (
            <Box py={2}>
              <CenterStack>
                <Alert severity='error'>{error}</Alert>
              </CenterStack>
            </Box>
          )}
          {isLoading && (
            <Box py={2}>
              <WarmupBox text='signing in...' />
            </Box>
          )}
        </Box>
        <Box pt={0} height={50}>
          <CenterStack>
            <PrimaryButton type='submit' text='submit' disabled={isLoading} />
          </CenterStack>
        </Box>
      </form>
    </Box>
  )
}

export default ReEnterPassword

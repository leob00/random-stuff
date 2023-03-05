import { TextField, Box, Typography, Alert } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import WarmupBox from 'components/Atoms/WarmupBox'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { validateUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const ReEnterPassword = ({ userProfile, onSuccess }: { userProfile: UserProfile; onSuccess: () => void }) => {
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
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
        <Box height={80}>
          {error.length > 0 && (
            <Box py={2}>
              <CenterStack>
                <Alert severity='error'>{error}</Alert>
              </CenterStack>
            </Box>
          )}
        </Box>
        <Box pt={3} height={80}>
          {isLoading ? (
            <WarmupBox text='signing in...' />
          ) : (
            <CenterStack>
              <SecondaryButton type='submit' text='submit'></SecondaryButton>
            </CenterStack>
          )}
        </Box>
      </form>
    </Box>
  )
}

export default ReEnterPassword

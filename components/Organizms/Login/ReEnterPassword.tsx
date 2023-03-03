import { TextField, Box, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { validateUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const ReEnterPassword = ({ userProfile, onSuccess }: { userProfile: UserProfile; onSuccess: () => void }) => {
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const result = await validateUserCSR(userProfile?.username!, password)
    if (!result) {
      setError('failed to authenticate')
    } else {
      onSuccess()
    }
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }
  return (
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
      {error.length > 0 && (
        <Box py={2}>
          <CenterStack>
            <Typography>failed to authenticate.</Typography>
          </CenterStack>
        </Box>
      )}
      <Box pt={3}>
        <CenterStack>
          <SecondaryButton type='submit' text='submit'></SecondaryButton>
        </CenterStack>
      </Box>
    </form>
  )
}

export default ReEnterPassword

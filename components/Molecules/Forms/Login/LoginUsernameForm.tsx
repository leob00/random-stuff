import { Alert, Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'

const UsernameLoginSchema = z.object({
  username: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type UsernameLogin = z.infer<typeof UsernameLoginSchema>

const LoginUsernameForm = ({ title = 'Log in', onSubmitted, error }: { title?: string; onSubmitted: (data: UsernameLogin) => void; error?: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameLogin>({
    resolver: zodResolver(UsernameLoginSchema),
  })
  const onSubmit: SubmitHandler<UsernameLogin> = (formData: UsernameLogin) => {
    const submitData = { ...formData }
    onSubmitted(submitData)
  }
  return (
    <Box>
      <Typography variant='h5' py={2}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <TextField
            {...register('username')}
            size='small'
            margin='dense'
            slotProps={{
              input: {
                color: 'secondary',
                autoComplete: 'username',
              },
            }}
            error={!!errors.username?.message}
          />
          <TextField
            type='password'
            {...register('password')}
            size='small'
            margin='dense'
            slotProps={{
              input: {
                color: 'secondary',
                autoComplete: 'current-password',
              },
            }}
            error={!!errors.username?.message}
          />
          {error && <Alert severity={'error'}>{error}</Alert>}
          <HorizontalDivider />
          <Box display={'flex'} justifyContent={'flex-end'}>
            <PrimaryButton text='log in' type='submit' size='small' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default LoginUsernameForm

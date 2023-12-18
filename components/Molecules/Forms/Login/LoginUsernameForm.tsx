import { Alert, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from '../ReactHookForm/ControlledFreeTextInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'

const UsernameLoginSchema = z.object({
  username: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type UsernameLogin = z.infer<typeof UsernameLoginSchema>

const LoginUsernameForm = ({
  obj,
  title = 'Log in',
  onSubmitted,
  error,
}: {
  obj: UsernameLogin
  title?: string
  onSubmitted: (data: UsernameLogin) => void
  error?: string
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsernameLogin>({
    resolver: zodResolver(UsernameLoginSchema),
  })
  const onSubmit: SubmitHandler<UsernameLogin> = (formData: UsernameLogin) => {
    const submitData = { ...formData }
    onSubmitted(submitData)
  }
  return (
    <Box maxWidth={{ xs: '100%', md: '80%' }}>
      <Typography variant='h5' py={2}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <ControlledFreeTextInput control={control} fieldName='username' defaultValue={obj.username} label='' placeholder='email' required />
          <ControlledFreeTextInput control={control} fieldName='password' defaultValue={obj.username} label='' placeholder='password' type={'password'} />
          {errors.username && <Alert severity={'error'}>{errors.username?.message}</Alert>}
          {errors.password && <Alert severity={'error'}>{errors.password?.message}</Alert>}
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

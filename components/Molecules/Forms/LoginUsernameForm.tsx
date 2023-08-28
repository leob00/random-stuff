import { Box, Stack, Typography } from '@mui/material'

import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from './ReactHookForm/ControlledFreeTextInput'
import { ControlledDatePicker } from './ReactHookForm/ControlledDatePicker'
import { z } from 'zod'

const UsernameLoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type UsernameLogin = z.infer<typeof UsernameLoginSchema>

const LoginUsernameForm = ({ obj, title = 'Log in', onSubmitted }: { obj: UsernameLogin; title?: string; onSubmitted: (data: UsernameLogin) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsernameLogin>()
  const onSubmit: SubmitHandler<UsernameLogin> = (formData: UsernameLogin) => {
    const submitData = { ...formData }
    try {
      const parsed = UsernameLoginSchema.parse(submitData)
      onSubmitted(parsed)
    } catch (err) {
      console.log(err)
    }

    reset()
  }
  return (
    <Box>
      <Typography variant='h5' py={2}>
        {title}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <ControlledFreeTextInput control={control} fieldName='username' defaultValue={obj.username} label='' placeholder='username' required />
          <ControlledFreeTextInput
            control={control}
            fieldName='password'
            defaultValue={obj.username}
            label=''
            placeholder='username'
            required
            type={'password'}
          />
          <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'center'}>
            <SecondaryButton text='submit' type='submit' size='small' width={80} />
          </Stack>
        </Box>
      </form>
    </Box>
  )
}

export default LoginUsernameForm

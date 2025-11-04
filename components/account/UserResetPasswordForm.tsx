'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, TextField, Typography } from '@mui/material'
import { confirmResetPassword } from 'aws-amplify/auth'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const ResetPasswordSchema = z
  .object({
    verificationCode: z.string().min(4, 'required'),
    password: z.string().min(6, ''),
    confirmPassword: z.string().min(6, 'required'),
  })
  .refine((val) => val.password === val.confirmPassword, { message: 'passwords do not match', path: ['confirmPassword'] })

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>
type ServerError = {
  message: string
}
const UserResetPasswordForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onChange',
    //defaultValues: { verificationCode: verificationCode },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (formData) => {
    setIsLoading(true)
    const submitData = { ...formData }
    const user = await getUserCSR()
    if (user) {
      try {
        await confirmResetPassword({ username: user.email, confirmationCode: submitData.verificationCode, newPassword: submitData.password })
        setSuccess(true)
      } catch (error) {
        const err = error as ServerError
        setError('confirmPassword', { message: err.message })
        //console.error('Error confirming password reset:', error.message)
      }
    }
    setIsLoading(false)
  }
  return (
    <Box py={2}>
      {success && (
        <Box display={'flex'} justifyContent={'center'}>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography textAlign={'center'} variant='h5'>
              Password updated!
            </Typography>
            <Typography>You may need to reauthenticate on other devices.</Typography>
            <SuccessButton text='Continue' onClick={onSuccess} />
          </Box>
        </Box>
      )}
      {!success && (
        <>
          <CenteredHeader title='Password Reset' />

          <CenterStack>
            <Typography variant='caption'>
              Please make sure your password is at least 6 characters in length and contains at least one uppercase character and one numeric character.
            </Typography>
          </CenterStack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display={'flex'} justifyContent={'center'}>
              <Box display={'flex'} flexDirection={'column'} gap={2} py={4}>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Typography width={160} textAlign={'right'}>
                    code:
                  </Typography>
                  <TextField
                    type='password'
                    {...register('verificationCode')}
                    size='small'
                    margin='dense'
                    slotProps={{
                      input: {
                        color: 'secondary',
                        autoComplete: 'username',
                      },
                    }}
                    error={!!errors.verificationCode?.message}
                  />
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Typography width={160} textAlign={'right'}>
                    password:
                  </Typography>
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
                    error={!!errors.password?.message}
                    helperText={errors.password?.message}
                  />
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Typography width={160} textAlign={'right'}>
                    confirm password:
                  </Typography>
                  <TextField
                    type='password'
                    {...register('confirmPassword')}
                    size='small'
                    margin='dense'
                    slotProps={{
                      input: {
                        color: 'secondary',
                        autoComplete: 'current-password',
                      },
                    }}
                    error={!!errors.confirmPassword?.message}
                    helperText={errors.confirmPassword?.message}
                  />
                </Box>
                <Box py={2} display={'flex'} justifyContent={'flex-end'} gap={2}>
                  <SecondaryButton text='cancel' onClick={onCancel} />
                  <PrimaryButton type='submit' text='submit' loading={isLoading} />
                </Box>
              </Box>
            </Box>
          </form>
        </>
      )}
    </Box>
  )
}

export default UserResetPasswordForm

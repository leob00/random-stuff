'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ResetPasswordSchema = z.object({
  verificationCode: z.string().min(4),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
})
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>

const UserResetPasswordForm = ({ verificationCode, onSuccess }: { verificationCode: string; onSuccess: () => void }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onChange',
    defaultValues: { verificationCode: verificationCode },
  })
  return (
    <Box py={2}>
      <CenteredHeader title='Password Reset' />

      <CenterStack>
        <Typography variant='caption'>
          Please make sure your password is at least 6 characters in length and contains at least one uppercase character and one numeric character.
        </Typography>
      </CenterStack>
    </Box>
  )
}

export default UserResetPasswordForm

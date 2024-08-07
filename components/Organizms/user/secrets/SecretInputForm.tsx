import { zodResolver } from '@hookform/resolvers/zod'
import { Box, TextField } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const SecretSchema = z.object({
  title: z.string().min(1),
  secret: z.string().min(1),
  notes: z.string().optional(),
})

export type SecretFields = z.infer<typeof SecretSchema>

const SecretInputForm = ({ currentValues, onSubmitted, onCancel, onDelete }: { currentValues: UserSecret; onSubmitted: (data: UserSecret) => void; onCancel: () => void; onDelete: () => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<SecretFields>({
    resolver: zodResolver(SecretSchema),
    mode: 'onBlur',
    defaultValues: currentValues,
  })
  const onSubmit: SubmitHandler<SecretFields> = (formData) => {
    const submitData: UserSecret = { ...formData, id: currentValues.id, title: formData.title, secret: formData.secret, notes: formData.notes }
    onSubmitted(submitData)
  }
  return (
    <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextField
            {...register('title')}
            fullWidth
            label='name'
            autoComplete='off'
            size='small'
            margin='dense'
            InputProps={{
              autoComplete: 'off',
            }}
            error={!!errors.title?.message}
          />
        </Box>
        <Box>
          <TextField
            {...register('secret')}
            fullWidth
            label='secret'
            autoComplete='off'
            size='small'
            margin='dense'
            InputProps={{
              autoComplete: 'off',
            }}
            error={!!errors.secret?.message}
          />
        </Box>
        <Box>
          <TextField
            {...register('notes')}
            fullWidth
            multiline
            rows={4}
            label={'notes'}
            placeholder='notes'
            autoComplete='off'
            size='small'
            margin='dense'
            InputProps={{
              autoComplete: 'off',
            }}
            error={!!errors.notes?.message}
          />
        </Box>
        <Box display={'flex'} gap={2} pt={4} justifyContent={'center'}>
          <SecondaryButton text={'close'} onClick={onCancel} size='small' />
          <DangerButton text={'delete'} onClick={onDelete} size='small' />
          <PrimaryButton text='save' type='submit' size='small' />
        </Box>
      </form>
    </Box>
  )
}
export default SecretInputForm

import { Alert, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from '../ReactHookForm/ControlledFreeTextInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'

const PorfolioFieldsSchema = z.object({
  name: z.string().min(1, { message: 'Please name your portfolio' }),
})

export type PorfolioFields = z.infer<typeof PorfolioFieldsSchema>

const EditPortfolioForm = ({
  obj,
  title,
  onSubmitted,
  onCancel,
  error,
}: {
  obj: PorfolioFields
  title?: string
  onSubmitted: (data: PorfolioFields) => void
  onCancel: () => void
  error?: string
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PorfolioFields>({
    resolver: zodResolver(PorfolioFieldsSchema),
  })
  const onSubmit: SubmitHandler<PorfolioFields> = (formData: PorfolioFields) => {
    const submitData = { ...formData }
    onSubmitted(submitData)
  }
  return (
    <Box>
      {title && (
        <Typography variant='h5' py={2}>
          {title}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={4}>
          <ControlledFreeTextInput control={control} fieldName='name' defaultValue={obj.name} label='' placeholder='name *' />
          {errors.name && <Alert severity={'error'}>{errors.name?.message}</Alert>}
          {error && <Alert severity={'error'}>{error}</Alert>}
          <Stack direction={'row'} alignItems={'center'} gap={2} justifyContent={'flex-end'}>
            <Box>
              <SecondaryButton text='cancel' size='small' onClick={onCancel} />
            </Box>
            <PrimaryButton text='save' type='submit' size='small' />
          </Stack>
        </Box>
      </form>
    </Box>
  )
}

export default EditPortfolioForm

import { Alert, Box, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from '../ReactHookForm/ControlledFreeTextInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const checkName = (val: any) => {
  const text = String(val)
  if (text.includes('/') || text.includes('.')) {
    return false
  }
  return true
}

const FolderFieldsSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((val: any) => checkName(val), { message: 'Please enter a valid name' }),
})

export type FolderFields = z.infer<typeof FolderFieldsSchema>

const AddFolderForm = ({ onCancel }: { onCancel: () => void }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FolderFields>({
    resolver: zodResolver(FolderFieldsSchema),
  })
  const theme = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit: SubmitHandler<FolderFields> = (formData) => {
    setIsLoading(true)
    const submitData = { ...formData }
    console.log(submitData)
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={4}>
          <Box>
            <ControlledFreeTextInput control={control} fieldName='name' defaultValue={''} label='' placeholder='name *' />
          </Box>

          {errors.name && <Alert severity={'error'}>{errors.name?.message}</Alert>}
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

export default AddFolderForm

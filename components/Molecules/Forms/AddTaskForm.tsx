import { Box, Stack, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DateAndTimePicker2 from './ReactHookForm/DateAndTimePicker2'
import { UserTask } from 'components/Organizms/user/goals/goalModels'

const AddTaskSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => val && val.length > 0, { message: 'required' }),
  dueDate: z.string().optional().nullable(),
})

type AddTaskInput = z.infer<typeof AddTaskSchema>

const AddTaskForm = ({ task, onSubmitted }: { task: UserTask; onSubmitted: (data: UserTask) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<AddTaskInput>({
    resolver: zodResolver(AddTaskSchema),
    mode: 'onSubmit',
    shouldUnregister: false,
  })
  const onSubmit: SubmitHandler<AddTaskInput> = (formData) => {
    const submitData: UserTask = { ...task, body: formData.name, dueDate: formData.dueDate ?? undefined }
    onSubmitted(submitData)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display={'flex'} gap={1} alignItems={'flex-start'} py={1}>
        <Box>
          <TextField
            {...register('name')}
            autoComplete='off'
            size='small'
            slotProps={{
              input: {
                color: 'secondary',
                autoComplete: 'off',
              },
            }}
            helperText={errors.name?.message}
            error={!!errors.name?.message}
          />
        </Box>
        <Box>
          <Controller
            name={'dueDate'}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <DateAndTimePicker2 errorMessage={errors.dueDate?.message} value={value} onDateSelected={onChange} {...field} />
            )}
          />
        </Box>
        <Box pt={0.5}>
          <PrimaryButton text='add' type='submit' size='small' />
        </Box>
      </Box>
    </form>
  )
}

export default AddTaskForm

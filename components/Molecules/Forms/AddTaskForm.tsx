import { Stack, TextField } from '@mui/material'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DateAndTimePicker2 from './ReactHookForm/DateAndTimePicker2'

const AddTaskSchema = z.object({
  name: z.string().min(1),
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
  })
  const onSubmit: SubmitHandler<AddTaskInput> = (formData) => {
    const submitData: UserTask = { ...task, body: formData.name, dueDate: formData.dueDate ?? undefined }
    onSubmitted(submitData)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'row'} spacing={1}>
        <TextField
          {...register('name')}
          autoComplete='off'
          size='small'
          margin='dense'
          InputProps={{
            color: 'secondary',
            autoComplete: 'off',
          }}
          error={!!errors.name?.message}
        />
        <Controller
          name={'dueDate'}
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <DateAndTimePicker2 errorMessage={errors.dueDate?.message} value={value} onDateSelected={onChange} {...field} />
          )}
        />
        <PrimaryButton text='add' type='submit' size='small' />
      </Stack>
    </form>
  )
}

export default AddTaskForm

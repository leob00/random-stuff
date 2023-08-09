import { Stack } from '@mui/material'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from './ReactHookForm/ControlledFreeTextInput'
import { ControlledDatePicker } from './ReactHookForm/ControlledDatePicker'

const AddTaskForm = ({ task, onSubmitted }: { task: UserTask; onSubmitted: (data: UserTask) => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserTask>()
  const onSubmit: SubmitHandler<UserTask> = (formData: UserTask) => {
    const submitData = { ...formData }

    onSubmitted(submitData)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'row'} spacing={1}>
        <ControlledFreeTextInput control={control} fieldName='body' defaultValue={task.body ?? ''} label='' placeholder='new task' required />
        <ControlledDatePicker control={control} fieldName='dueDate' defaultValue={task.dueDate ?? null} placeholder={'due date'} label={'due date'} />
        <SecondaryButton text='add' type='submit' size='small' width={80} />
      </Stack>
    </form>
  )
}

export default AddTaskForm

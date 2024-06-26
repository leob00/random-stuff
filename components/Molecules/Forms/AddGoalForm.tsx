import { Stack } from '@mui/material'
import { UserGoal } from 'lib/models/userTasks'
import React from 'react'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'

const EditGoalForm = ({ goal, onSubmit }: { goal: UserGoal; onSubmit: (data: UserGoal) => void }) => {
  const [formInput, setFormInput] = React.useReducer((state: UserGoal, newState: UserGoal) => ({ ...state, ...newState }), goal)
  const [valid, setValid] = React.useState(true)

  const handleDueDateChange = (dt?: string) => {
    setFormInput({ ...formInput, dueDate: dt })
  }
  const handleTitleChanged = (title: string) => {
    setFormInput({ ...formInput, body: title })
  }
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid = formInput.body !== undefined && formInput.body.trim().length > 0 && !formInput.body.includes('  ')
    setValid(isValid)
    if (isValid) {
      const goal = { ...formInput }
      setFormInput({ ...formInput, id: undefined, body: '' })
      onSubmit(goal)
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <Stack direction={'column'} spacing={2}>
        <FormTextBox defaultValue={formInput.body ?? ''} label={'new goal'} onChanged={handleTitleChanged} error={!valid} />
        <DateAndTimePicker onChanged={handleDueDateChange} label={'due date'} />
        <SecondaryButton text='add' type='submit' size='small' width={90} />
      </Stack>
    </form>
  )
}

export default EditGoalForm

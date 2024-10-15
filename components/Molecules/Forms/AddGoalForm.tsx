import { Stack } from '@mui/material'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { UserGoal } from 'components/Organizms/user/goals/goalModels'
import { useReducer, useState } from 'react'

const EditGoalForm = ({ goal, onSubmit }: { goal: UserGoal; onSubmit: (data: UserGoal) => void }) => {
  const [formInput, setFormInput] = useReducer((state: UserGoal, newState: UserGoal) => ({ ...state, ...newState }), goal)
  const [valid, setValid] = useState(true)

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

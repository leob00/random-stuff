import { Stack } from '@mui/material'
import { UserGoal } from 'lib/models/userTasks'
import React from 'react'
import DebouncedTextBox from 'components/Atoms/Inputs/DebouncedTextBox'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'

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
    //console.log(formInput)
    e.preventDefault()
    const isValid = formInput.body !== undefined && formInput.body.trim().length > 0 && !formInput.body.includes('  ')
    //console.log('isValid: ', isValid)
    //console.log('body: ', formInput.body)
    setValid(isValid)
    if (isValid) {
      const goal = cloneDeep(formInput)
      setFormInput({ ...formInput, id: undefined, body: undefined })
      onSubmit(goal)
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <Stack direction={'row'} spacing={1}>
        <FormTextBox defaultValue={formInput.body ?? ''} label={'new goal'} onChanged={handleTitleChanged} error={!valid} />
        <DateAndTimePicker onChanged={handleDueDateChange} label={'due date'} />
        <SecondaryButton text='add' type='submit' size='small' width={90} />
      </Stack>
    </form>
  )
}

export default EditGoalForm

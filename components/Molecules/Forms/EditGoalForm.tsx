import { Stack } from '@mui/material'
import { UserGoal } from 'lib/models/userTasks'
import React from 'react'
import DebouncedTextBox from 'components/Atoms/Inputs/DebouncedTextBox'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'

const EditGoalForm = ({ goal, onSubmit }: { goal: UserGoal; onSubmit: (data: UserGoal) => void }) => {
  const [formInput, setFormInput] = React.useReducer((state: UserGoal, newState: UserGoal) => ({ ...state, ...newState }), goal)

  const handleDueDateChange = (dt?: string) => {
    setFormInput({ ...formInput, dueDate: dt })
  }
  const handleTitleChanged = (title: string) => {
    setFormInput({ ...formInput, body: title })
  }
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //console.log(formInput)
    e.preventDefault()

    if (formInput.body && formInput.body.trim().length > 0) {
      onSubmit(formInput)
    } else {
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <Stack direction={'row'} spacing={1}>
        <FormTextBox defaultValue={''} label={'new goal'} onChanged={handleTitleChanged} />
        <DateAndTimePicker onChanged={handleDueDateChange} label={'due date'} />
        {/* {goalsDDL.length > 0 && <DropdownList options={goalsDDL} selectedOption={goalsDDL[0].value!} />} */}
        <SecondaryButton text='add' type='submit' size='small' width={80} />
      </Stack>
    </form>
  )
}

export default EditGoalForm

import { Box, Stack } from '@mui/material'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { UserGoal } from 'components/Organizms/user/goals/goalModels'
import { useReducer, useState } from 'react'
import DateAndTimePicker2 from './ReactHookForm/DateAndTimePicker2'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'

const EditGoalForm = ({ goal, onSubmit }: { goal: UserGoal; onSubmit: (data: UserGoal) => void }) => {
  const [formInput, setFormInput] = useReducer((state: UserGoal, newState: UserGoal) => ({ ...state, ...newState }), goal)
  const [valid, setValid] = useState(true)

  const handleDueDateChange = (dt?: string | null) => {
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
    <Box py={4} minWidth={300}>
      <form onSubmit={handleFormSubmit}>
        <Box gap={2} display={'flex'} flexDirection={'column'}>
          <Box>
            <FormTextBox defaultValue={formInput.body ?? ''} label='' placeHolder='name' onChanged={handleTitleChanged} error={!valid} />
          </Box>
          <Box>
            <DateAndTimePicker2 onDateSelected={handleDueDateChange} placeHolder='due date' value={formInput.dueDate} />
          </Box>
          <Box display={'flex'} justifyContent={'center'} pt={4}>
            <SuccessButton text='add' type='submit' size='medium' fullWidth />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default EditGoalForm

import { Stack } from '@mui/material'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'

const AddTaskForm = ({ task, onSubmit }: { task: UserTask; onSubmit: (data: UserTask) => void }) => {
  const [formInput, setFormInput] = React.useReducer((state: UserTask, newState: UserTask) => ({ ...state, ...newState }), task)
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
      const data = cloneDeep(formInput)
      setFormInput({ ...formInput, id: undefined, body: undefined })
      onSubmit(data)
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <Stack direction={'row'} spacing={1}>
        <FormTextBox defaultValue={formInput.body ?? ''} label={'new task'} onChanged={handleTitleChanged} error={!valid} />
        <DateAndTimePicker onChanged={handleDueDateChange} label={'due date'} />
        {/* {goalsDDL.length > 0 && <DropdownList options={goalsDDL} selectedOption={goalsDDL[0].value!} />} */}
        <SecondaryButton text='add' type='submit' size='small' width={80} />
      </Stack>
    </form>
  )
}

export default AddTaskForm

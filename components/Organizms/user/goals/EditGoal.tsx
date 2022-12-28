import { Box, Paper } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { UserGoal } from 'lib/models/userTasks'
import { cloneDeep } from 'lodash'
import React from 'react'

interface Model {
  goal: UserGoal
  isSaving: boolean
}

const EditGoal = ({ goal, onSaveGoal }: { goal: UserGoal; onSaveGoal: (item: UserGoal) => void }) => {
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), {
    goal: goal,
    isSaving: false,
  })

  const handleDueDateChange = async (text?: string) => {
    const goal = cloneDeep(model.goal)
    goal.dueDate = text
    setModel({ ...model, goal: goal })
  }
  const handleSubmitGoalChanges = async () => {
    setModel({ ...model, isSaving: true })
    onSaveGoal(model.goal)
  }
  const handleGoalBodyChange = async (text: string) => {
    const goal = { ...model.goal, body: text }
    setModel({ ...model, goal: goal })
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
        <FormTextBox
          width={'100%'}
          defaultValue={goal.body ?? ''}
          label={'name'}
          onChanged={handleGoalBodyChange}
          //onBlurred={handleSubmitGoalChanges}
          disabled={model.isSaving}
          maxLength={50}
        />
      </Box>
      <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
        <DateAndTimePicker disabled={model.isSaving} onChanged={handleDueDateChange} label={'due date'} defaultValue={goal.dueDate} />
      </Box>
      <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
        <SecondaryButton text={'save'} onClick={handleSubmitGoalChanges} disabled={model.isSaving} />
      </Box>
    </Paper>
  )
}

export default EditGoal

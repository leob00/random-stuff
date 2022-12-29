import { Box, Paper, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import { generateKeyPair } from 'crypto'
import { UserGoal, UserGoalSettings } from 'lib/models/userTasks'
import { cloneDeep } from 'lodash'
import React from 'react'

interface Model {
  goal: UserGoal
  isSaving: boolean
}

const EditGoal = ({
  goal,
  onSaveGoal,
  onShowCompletedTasks,
}: {
  goal: UserGoal
  onSaveGoal: (item: UserGoal) => void
  onShowCompletedTasks: (show: boolean) => void
}) => {
  const defaultSettings: UserGoalSettings = {
    showCompletedTasks: true,
  }
  if (!goal.settings) {
    goal.settings = defaultSettings
  }
  // console.log(goal.settings)

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
  const handleSetShowComp = async (checked: boolean) => {
    const g = cloneDeep(model.goal)
    g.settings!.showCompletedTasks = checked
    setModel({ ...model, goal: g })
    onShowCompletedTasks(checked)
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant='h6'>{model.goal.body}</Typography>
      <Box maxWidth={{ xs: 280, md: 500 }}>
        <Box py={2}>
          <FormTextBox
            width={'100%'}
            defaultValue={model.goal.body ?? ''}
            label={'name'}
            onChanged={handleGoalBodyChange}
            //onBlurred={handleSubmitGoalChanges}
            disabled={model.isSaving}
            maxLength={50}
          />
        </Box>
        <Box py={2}>
          <DateAndTimePicker disabled={model.isSaving} onChanged={handleDueDateChange} label={'due date'} defaultValue={goal.dueDate} />
        </Box>
        <Box py={2}>
          <OnOffSwitch isChecked={model.goal.settings?.showCompletedTasks} label={'show completed tasks'} onChanged={handleSetShowComp} />
        </Box>
        <Box py={2}>
          <SecondaryButton text={'save'} onClick={handleSubmitGoalChanges} disabled={model.isSaving} />
        </Box>
      </Box>
    </Paper>
  )
}

export default EditGoal

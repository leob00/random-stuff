import { Box, Stack, Typography } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import dayjs from 'dayjs'
import { getUserGoals, getUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import React from 'react'
import GoalDetailsMeta from './GoalDetailsMeta'
import TaskList from './TaskList'
import { UserGoalsModel } from './UserGoalsLayout'

interface Model {
  isLoading: boolean
  tasks: UserTask[]
}

const GoalDetails = ({
  model,
  goalId,
  handleGoalBodyChange,
  handleSubmitGoalChanges,
  handleDueDateChange,
  handleDeleteGoal,
  handleCloseSelectedGoal,
  handleSetGoalEditMode,
}: {
  model: UserGoalsModel
  goalId: string
  handleGoalBodyChange: (text: string) => void
  handleSubmitGoalChanges: () => void
  handleDueDateChange: (text?: string) => void
  handleDeleteGoal: (item: UserGoal) => void
  handleCloseSelectedGoal: () => void
  handleSetGoalEditMode: (isEdit: boolean) => void
}) => {
  const [taskModel, setTaskModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), { isLoading: true, tasks: [] })
  //const [tasks, setTasks] = React.useState<UserTask[]>([])

  React.useEffect(() => {
    const fn = async () => {
      console.log('loading tasks...')
      const result = await getUserGoalTasks(goalId)
      setTaskModel({ ...taskModel, tasks: result, isLoading: false })
    }
    fn()
  }, [goalId])

  return (
    <>
      {model.selectedGoal && (
        <Box pb={1} pl={2}>
          <GoalDetailsMeta goal={model.selectedGoal} />
          {!model.goalEditMode && <Box py={2}>{taskModel.isLoading ? <WarmupBox /> : <TaskList tasks={taskModel.tasks} />}</Box>}
          {model.goalEditMode && (
            <Box py={2}>
              <Stack direction={{ sx: 'column', md: 'row' }} display={'flex'} spacing={1} alignItems={'center'}>
                <FormTextBox
                  defaultValue={model.selectedGoal.body ?? ''}
                  label={'name'}
                  onChanged={handleGoalBodyChange}
                  onBlurred={handleSubmitGoalChanges}
                  disabled={model.isSaving}
                />
                <DateAndTimePicker disabled={model.isSaving} onChanged={handleDueDateChange} label={'due date'} defaultValue={model.selectedGoal.dueDate} />
              </Stack>
            </Box>
          )}
          <Box py={2}>
            <HorizontalDivider />
            <Stack direction={'row'} display={'flex'} justifyContent={'center'} spacing={1} alignItems={'center'} pt={2}>
              <DangerButton
                size='small'
                disabled={model.isSaving}
                text='delete'
                onClick={() => {
                  handleDeleteGoal(model.selectedGoal!)
                }}
              />
              {!model.goalEditMode ? (
                <SecondaryButton
                  size='small'
                  disabled={model.isSaving}
                  text={'edit'}
                  onClick={() => {
                    handleSetGoalEditMode(true)
                  }}
                />
              ) : (
                <SecondaryButton
                  size='small'
                  disabled={model.isSaving}
                  text={'cancel'}
                  onClick={() => {
                    handleSetGoalEditMode(false)
                  }}
                />
              )}
              <PassiveButton text='close' onClick={handleCloseSelectedGoal} disabled={model.isSaving} size='small' />
            </Stack>
          </Box>
        </Box>
      )}
    </>
  )
}

export default GoalDetails

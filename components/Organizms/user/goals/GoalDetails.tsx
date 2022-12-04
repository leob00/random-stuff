import { Box, Stack } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import WarmupBox from 'components/Atoms/WarmupBox'
import { getUserGoalTasks, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
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
  handleModifyGoal,
}: {
  model: UserGoalsModel
  goalId: string
  handleGoalBodyChange: (text: string) => void
  handleSubmitGoalChanges: () => void
  handleDueDateChange: (text?: string) => void
  handleDeleteGoal: (item: UserGoal) => void
  handleCloseSelectedGoal: () => void
  handleSetGoalEditMode: (isEdit: boolean) => void
  handleModifyGoal: (item: UserGoal) => void
}) => {
  const [taskModel, setTaskModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), { isLoading: true, tasks: [] })

  const handleAddTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = cloneDeep(taskModel.tasks)
    tasks.push(item)
    await putUserGoalTasks(goalId, tasks)
    setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
  }

  const handleModifyTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = filter(cloneDeep(taskModel.tasks), (e) => e.id !== item.id)
    tasks.push(item)
    const completed = filter(tasks, (e) => e.status === 'completed')
    tasks = orderBy(tasks, ['dueDate', 'status'], ['asc', 'desc'])
    if (model.selectedGoal) {
      const goal = cloneDeep(model.selectedGoal)
      goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      handleModifyGoal(goal)
    }
    await putUserGoalTasks(goalId, tasks)

    setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
  }
  const handleDeleteTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = filter(cloneDeep(taskModel.tasks), (e) => e.id !== item.id)
    const completed = filter(tasks, (e) => e.status === 'completed')
    if (model.selectedGoal) {
      const goal = cloneDeep(model.selectedGoal)
      goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      handleModifyGoal(goal)
    }
    await putUserGoalTasks(goalId, tasks)
    setTaskModel({ ...taskModel, tasks: orderBy(tasks, ['dueDate', 'status'], ['asc', 'desc']), isLoading: false })
  }

  React.useEffect(() => {
    const fn = async () => {
      console.log('loading tasks for goal: ', goalId)
      const result = await getUserGoalTasks(goalId)
      const tasks = orderBy(result, ['dueDate', 'status'], ['asc', 'desc'])
      //console.log(result)
      setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
    }
    fn()
  }, [goalId])

  return (
    <>
      {model.selectedGoal && (
        <Box pb={1} pl={2}>
          <GoalDetailsMeta goal={model.selectedGoal} />

          {model.goalEditMode && (
            <Box py={2}>
              <Stack direction={'row'} display={'flex'} spacing={1} alignItems={'center'}>
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
          <HorizontalDivider />

          <Box py={2} pl={2}>
            {taskModel.isLoading ? (
              <WarmupBox />
            ) : (
              <>
                <TaskList
                  username={model.username}
                  goalId={goalId}
                  tasks={taskModel.tasks}
                  onAddTask={handleAddTask}
                  onModifyTask={handleModifyTask}
                  onDeleteTask={handleDeleteTask}
                />
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

export default GoalDetails

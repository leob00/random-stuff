import { Close, Create, Delete } from '@mui/icons-material'
import { Box, Grid, Stack, IconButton } from '@mui/material'
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
    if (!item.status) {
      item.status = 'in progress'
    }
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = cloneDeep(taskModel.tasks)
    tasks.push(item)
    tasks = orderBy(tasks, ['status', 'dueDate'], ['desc', 'asc'])
    await putUserGoalTasks(goalId, tasks)
    setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
  }

  const handleModifyTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = filter(cloneDeep(taskModel.tasks), (e) => e.id !== item.id)
    tasks.push(item)
    const completed = filter(tasks, (e) => e.status === 'completed')
    tasks = orderBy(tasks, ['status', 'dueDate'], ['desc', 'asc'])
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
    setTaskModel({ ...taskModel, tasks: orderBy(tasks, ['status', 'dueDate'], ['desc', 'asc']), isLoading: false })
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await getUserGoalTasks(goalId)
      result.forEach((task) => {
        if (!task.status) {
          task.status = 'in progress'
        }
      })
      const tasks = orderBy(result, ['status', 'dueDate'], ['desc', 'asc'])
      setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
    }
    fn()
  }, [goalId])

  return (
    <>
      {model.selectedGoal && (
        <Box pb={1} pl={2}>
          <Grid container columns={{ xs: 10, md: 8 }} justifyContent={'center'} spacing={2}>
            <Grid item>
              <Stack direction={'row'} spacing={1}>
                <IconButton
                  onClick={() => {
                    handleSetGoalEditMode(!model.goalEditMode)
                  }}
                  color='secondary'
                >
                  <Create />
                </IconButton>
                <Stack>
                  <IconButton
                    onClick={() => {
                      handleDeleteGoal(model.selectedGoal!)
                    }}
                    color='secondary'
                  >
                    <Delete color='error' />
                  </IconButton>
                </Stack>
                <Stack>
                  <IconButton onClick={handleCloseSelectedGoal} color='secondary'>
                    <Close />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          {/*  <GoalDetailsMeta goal={model.selectedGoal} /> */}
          {model.goalEditMode && (
            <>
              <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
                <FormTextBox
                  width={'100%'}
                  defaultValue={model.selectedGoal.body ?? ''}
                  label={'name'}
                  onChanged={handleGoalBodyChange}
                  //onBlurred={handleSubmitGoalChanges}
                  disabled={model.isSaving}
                />
              </Box>
              <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
                <DateAndTimePicker disabled={model.isSaving} onChanged={handleDueDateChange} label={'due date'} defaultValue={model.selectedGoal.dueDate} />
              </Box>
              <Box py={2} maxWidth={{ xs: 280, md: 500 }}>
                <SecondaryButton text={'save'} onClick={handleSubmitGoalChanges} disabled={model.isSaving} />
              </Box>
            </>
          )}
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

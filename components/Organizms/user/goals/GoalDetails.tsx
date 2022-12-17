import { Close, Create, Delete } from '@mui/icons-material'
import { Box, Grid, Stack, IconButton } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { getUserGoalTasks, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'
import TaskList from './TaskList'
import { reorderTasks, UserGoalsModel } from './UserGoalsLayout'

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
  onLoaded,
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
  onLoaded?: (goal: UserGoal, tasks: UserTask[]) => void
}) => {
  const [taskModel, setTaskModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), { isLoading: true, tasks: [] })

  const handleAddTask = async (item: UserTask) => {
    item.status = 'in progress'
    await handleModifyTask(item)
  }

  const handleModifyTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    let tasks = filter(cloneDeep(taskModel.tasks), (e) => e.id !== item.id)
    tasks.push(item)
    tasks = orderBy(tasks, ['status', 'dueDate'], ['desc', 'asc'])
    await putUserGoalTasks(model.username, goalId, tasks)
    setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })

    if (model.selectedGoal) {
      const goal = cloneDeep(model.selectedGoal)
      goal.stats = getGoalStats(tasks)
      if (tasks.length > 0) {
        const completed = filter(tasks, (e) => e.status === 'completed')

        goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      } else {
        goal.completePercent = 0
      }
      handleModifyGoal(goal)
    }
  }
  const handleDeleteTask = async (item: UserTask) => {
    setTaskModel({ ...taskModel, isLoading: true })
    if (model.selectedGoal) {
      let goal = cloneDeep(model.selectedGoal)
      let tasks = reorderTasks(filter(cloneDeep(taskModel.tasks), (e) => e.id !== item.id))
      goal.stats = getGoalStats(tasks)
      await putUserGoalTasks(model.username, goal.id!, tasks)
      setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
      if (tasks.length > 0) {
        const completed = filter(tasks, (e) => e.status === 'completed')

        goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      } else {
        goal.completePercent = 0
      }
      handleModifyGoal(goal)
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await getUserGoalTasks(goalId)
      result.forEach((task) => {
        if (!task.status) {
          task.status = 'in progress'
        }
      })
      const tasks = reorderTasks(result)
      setTaskModel({ ...taskModel, tasks: tasks, isLoading: false })
      onLoaded?.(model.selectedGoal!, tasks)
    }
    fn()
  }, [goalId])

  return (
    <>
      {model.selectedGoal && (
        <Box pb={1}>
          <Grid container columns={{ xs: 10, md: 8 }} justifyContent={'center'} spacing={2}>
            <Grid item>
              <Stack direction={'row'} spacing={1}>
                <IconButton
                  id='goalDetails'
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
          <Box py={2} pl={1}>
            {taskModel.isLoading ? (
              <>
                <WarmupBox />
                <Box py={2}>
                  <TextSkeleton />
                </Box>
                <Box py={2}>
                  <TextSkeleton />
                </Box>
                <Box py={2}>
                  <TextSkeleton />
                </Box>
                <Box py={2}>
                  <TextSkeleton />
                </Box>
              </>
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

import { Close, Create, Delete } from '@mui/icons-material'
import { Box, Grid, Stack, IconButton, Typography } from '@mui/material'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import { getUserGoalTasks, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { replaceItemInArray } from 'lib/util/collections'
import { calculatePercentInt } from 'lib/util/numberUtil'
import { cloneDeep, filter } from 'lodash'
import React from 'react'
import EditGoal from './EditGoal'
import TaskList from './TaskList'
import { reorderTasks, UserGoalsModel } from './UserGoalsLayout'

interface Model {
  isLoading: boolean
  tasks: UserTask[]
  filteredTasks: UserTask[]
  selectedGoal: UserGoal
}

const GoalDetails = ({
  model,
  goalId,
  handleDeleteGoal,
  handleCloseSelectedGoal,
  handleSetGoalEditMode,
  handleModifyGoal,
  onLoaded,
}: {
  model: UserGoalsModel
  goalId: string
  handleDeleteGoal: (item: UserGoal) => void
  handleCloseSelectedGoal: () => void
  handleSetGoalEditMode: (isEdit: boolean) => void
  handleModifyGoal: (item: UserGoal) => void
  onLoaded?: (goal: UserGoal, tasks: UserTask[]) => void
}) => {
  if (!model.selectedGoal?.settings) {
    model.selectedGoal!.settings = { showCompletedTasks: true }
  }
  const [goalDetailModel, setGoalDetailModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), {
    isLoading: true,
    tasks: [],
    filteredTasks: [],
    selectedGoal: model.selectedGoal!,
  })

  const handleAddTask = async (item: UserTask) => {
    setGoalDetailModel({ ...goalDetailModel, isLoading: true })
    item.status = 'in progress'
    let tasks = cloneDeep(goalDetailModel.tasks)
    tasks.push(item)
    tasks = reorderTasks(tasks)
    const goal = cloneDeep(goalDetailModel.selectedGoal!)
    goal.stats = getGoalStats(tasks)
    if (tasks.length > 0) {
      const completed = filter(tasks, (e) => e.status === 'completed')
      goal.completePercent = calculatePercentInt(completed.length, tasks.length)
    } else {
      goal.completePercent = 0
    }
    await putUserGoalTasks(model.username, goal.id!, tasks)
    setGoalDetailModel({ ...goalDetailModel, selectedGoal: goal, tasks: tasks, isLoading: false })
    handleModifyGoal(goal)
  }

  const handleModifyTask = async (item: UserTask) => {
    setGoalDetailModel({ ...goalDetailModel, isLoading: true })
    let tasks = cloneDeep(goalDetailModel.tasks)
    replaceItemInArray<UserTask>(item, tasks, 'id', item.id!)
    tasks = reorderTasks(tasks)
    await putUserGoalTasks(model.username, model.selectedGoal!.id!, tasks)

    if (goalDetailModel.selectedGoal) {
      const goal = cloneDeep(goalDetailModel.selectedGoal)
      goal.stats = getGoalStats(tasks)
      if (tasks.length > 0) {
        const completed = filter(tasks, (e) => e.status === 'completed')
        goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      } else {
        goal.completePercent = 0
      }
      handleModifyGoal(goal)
      setGoalDetailModel({ ...goalDetailModel, selectedGoal: goal, tasks: tasks, isLoading: false })
    }
  }
  const handleDeleteTask = async (item: UserTask) => {
    setGoalDetailModel({ ...goalDetailModel, isLoading: true })
    if (model.selectedGoal) {
      let goal = cloneDeep(model.selectedGoal)
      let tasks = reorderTasks(filter(cloneDeep(goalDetailModel.tasks), (e) => e.id !== item.id))
      goal.stats = getGoalStats(tasks)
      await putUserGoalTasks(model.username, goal.id!, tasks)
      if (tasks.length > 0) {
        const completed = filter(tasks, (e) => e.status === 'completed')
        goal.completePercent = calculatePercentInt(completed.length, tasks.length)
      } else {
        goal.completePercent = 0
      }
      setGoalDetailModel({ ...goalDetailModel, tasks: tasks, isLoading: false, selectedGoal: goal })
      handleModifyGoal(goal)
    }
  }

  const filterTasks = (show: boolean) => {
    const g = cloneDeep(goalDetailModel.selectedGoal)
    if (!g.settings) {
      g.settings = { showCompletedTasks: show }
    } else {
      g.settings.showCompletedTasks = show
    }

    let displayTasks = cloneDeep(goalDetailModel.tasks)
    if (!show) {
      displayTasks = filter(displayTasks, (e) => e.status !== 'completed')
    }
    return displayTasks
  }

  const handleShowCompletedTasks = (show: boolean) => {
    //console.log('show: ', show)
    //setGoalDetailModel({ ...goalDetailModel, isLoading: true, filteredTasks: [] })
    /* setGoalDetailModel({ ...goalDetailModel, filteredTasks: [], isLoading: true })
    const g = cloneDeep(goalDetailModel.selectedGoal)
    if (!g.settings) {
      g.settings = { showCompletedTasks: show }
    } else {
      g.settings.showCompletedTasks = show
    }
    let displayTasks = filterTasks(show)
    console.log('displayed tasks: ', displayTasks.length)
    setGoalDetailModel({ ...goalDetailModel, selectedGoal: g, filteredTasks: displayTasks, isLoading: false }) */
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await getUserGoalTasks(goalId)
      result.forEach((task) => {
        if (!task.status) {
          task.status = 'in progress'
        }
      })
      const hideComp = goalDetailModel.selectedGoal.settings && !goalDetailModel.selectedGoal.settings.showCompletedTasks
      console.log('hide completed: ', hideComp)
      let tasks = reorderTasks(result)
      let filteredTasks = tasks
      /*  if (hideComp === true) {
        filteredTasks = filter(tasks, (e) => e.status !== 'completed')
      } */
      console.log('filtered tasks: ', filterTasks.length)
      setGoalDetailModel({ ...goalDetailModel, tasks: tasks, filteredTasks: filteredTasks, isLoading: false })
      onLoaded?.(goalDetailModel.selectedGoal, tasks)
    }
    fn()
  }, [goalId])

  return (
    <>
      {model.selectedGoal && (
        <Box pb={1}>
          <Grid container columns={{ xs: 10, md: 8 }} justifyContent={'left'} spacing={2} sx={{ paddingLeft: 2, paddingTop: 1, paddingBottom: 1 }}>
            <Grid item>
              <Stack direction={'row'} spacing={1}>
                <IconButton
                  size='small'
                  id='goalDetails'
                  onClick={() => {
                    handleSetGoalEditMode(!model.goalEditMode)
                  }}
                  color='secondary'
                >
                  <Create fontSize='small' />
                </IconButton>
                <Stack>
                  <IconButton
                    size='small'
                    onClick={() => {
                      handleDeleteGoal(model.selectedGoal!)
                    }}
                    color='secondary'
                  >
                    <Delete fontSize='small' color='error' />
                  </IconButton>
                </Stack>
                <Stack>
                  <IconButton size='small' onClick={handleCloseSelectedGoal} color='secondary'>
                    <Close fontSize='small' />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          {model.goalEditMode ? (
            <Box pt={2}>
              <EditGoal goal={model.selectedGoal} onSaveGoal={handleModifyGoal} onShowCompletedTasks={handleShowCompletedTasks} />
            </Box>
          ) : (
            <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
              <Stack direction='column' justifyContent='left' alignItems='left'>
                <Typography variant={'subtitle1'}>{`${model.selectedGoal.body}`}</Typography>
                {goalDetailModel.selectedGoal.stats && (
                  <>
                    <Typography variant='body2'>{`tasks: ${
                      Number(goalDetailModel.selectedGoal.stats.completed) + Number(goalDetailModel.selectedGoal.stats.inProgress)
                    }`}</Typography>
                    <Typography variant='body2'>{`completed: ${goalDetailModel.selectedGoal.stats.completed}`}</Typography>
                    <Typography variant='body2'>{`in progress: ${goalDetailModel.selectedGoal.stats.inProgress}`}</Typography>
                    {goalDetailModel.selectedGoal.stats.pastDue > 0 && (
                      <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${goalDetailModel.selectedGoal.stats.pastDue}`}</Typography>
                    )}
                  </>
                )}
              </Stack>
              <>
                {goalDetailModel.selectedGoal.completePercent !== undefined && (
                  <>
                    <Stack flexDirection='row' py={1} flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-start'}>
                      {!goalDetailModel.isLoading ? (
                        <ProgressBar
                          value={goalDetailModel.selectedGoal.completePercent}
                          toolTipText={`${goalDetailModel.selectedGoal.completePercent}% complete`}
                          width={80}
                        />
                      ) : (
                        <TextSkeleton>
                          <ProgressBar
                            value={goalDetailModel.selectedGoal.completePercent}
                            toolTipText={`${goalDetailModel.selectedGoal.completePercent}% complete`}
                            width={80}
                          />
                        </TextSkeleton>
                      )}
                    </Stack>
                  </>
                )}
              </>
            </Stack>
          )}

          <Box py={1}>
            {goalDetailModel.isLoading ? (
              <>
                <WarmupBox />
                <PageWithGridSkeleton />
              </>
            ) : (
              <>
                <TaskList
                  username={model.username}
                  selectedGoal={goalDetailModel.selectedGoal}
                  tasks={goalDetailModel.tasks}
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

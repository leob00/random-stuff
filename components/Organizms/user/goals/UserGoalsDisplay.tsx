import { Box, Button, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import BoxSkeleton from 'components/Atoms/Skeletons/BoxSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import { CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { putUserGoals, putUserGoalTasks, getUserTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { replaceItemInArray } from 'lib/util/collections'
import { getUtcNow, getSecondsFromEpoch } from 'lib/util/dateUtil'
import { areObjectsEqual } from 'lib/util/objects'
import { cloneDeep, orderBy, filter } from 'lodash'
import React from 'react'
import GoalCharts from './GoalCharts'
import GoalDetails from './GoalDetails'
import { UserGoalAndTask, UserGoalsModel } from './UserGoalsLayout'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'

const UserGoalsDisplay = ({ goals, tasks, username }: { goals: UserGoal[]; tasks: UserTask[]; username: string }) => {
  const mapGoalTasks = (goals: UserGoal[], tasks: UserTask[]) => {
    const goalsAndTasks: UserGoalAndTask[] = []
    goals.forEach((goal) => {
      const goalTasks = filter(tasks, (e) => e.goalId === goal.id)
      goal.stats = getGoalStats(goalTasks)
      if (!goal.completePercent) {
        goal.completePercent = 0
      }
      goalsAndTasks.push({
        goal: goal,
        tasks: goalTasks,
      })
    })
    return goalsAndTasks
  }
  const goalsAndTasks = mapGoalTasks(goals, tasks)
  const defaultModel: UserGoalsModel = {
    goals: goals,
    username: username,
    isLoading: false,
    goalEditMode: false,
    isSaving: false,
    showConfirmDeleteGoal: false,
    showAddGoalForm: false,
    goalsAndTasks: goalsAndTasks,
  }
  const [model, setModel] = React.useReducer((state: UserGoalsModel, newState: UserGoalsModel) => ({ ...state, ...newState }), defaultModel)
  const handleEditGoalSubmit = async (item: UserGoal) => {
    setModel({ ...model, isLoading: true })
    let goals = cloneDeep(model).goals
    const newGoal = !item.id
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
    }
    item.dateModified = getUtcNow().format()
    goals.push(item)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, selectedGoal: newGoal ? item : undefined, isLoading: false, showAddGoalForm: false })
  }

  const handleGoalClick = async (item: UserGoal) => {
    setModel({ ...model, selectedGoal: item, barChart: undefined })
  }
  const handleCloseSelectedGoal = () => {
    setModel({ ...model, selectedGoal: undefined, goalEditMode: false })
  }
  const handleDeleteGoal = (item: UserGoal) => {
    setModel({ ...model, selectedGoal: item, showConfirmDeleteGoal: true })
  }
  const handleYesDeleteGoal = async () => {
    setModel({ ...model, isLoading: true, showConfirmDeleteGoal: false })
    const goalList = filter(model.goals, (e) => e.id !== model.selectedGoal?.id)
    await putUserGoals(constructUserGoalsKey(username), goalList)
    await putUserGoalTasks(model.username, model.selectedGoal?.id!, [], getSecondsFromEpoch())
    setModel({ ...model, goals: goalList, selectedGoal: undefined, isLoading: false, showConfirmDeleteGoal: false })
  }

  const handleSetGoalEditMode = (isEdit: boolean) => {
    setModel({ ...model, goalEditMode: isEdit })
  }

  const saveGoal = async (goal: UserGoal) => {
    setModel({ ...model, isSaving: false, isLoading: false })
    goal.dateModified = getUtcNow().format()
    let goals = filter(cloneDeep(model.goals), (e) => e.id !== goal!.id)
    goals.push(goal)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, isSaving: false, isLoading: false, goalEditMode: false, selectedGoal: goal })
  }

  const handelGoalDetailsLoaded = async (goal: UserGoal, tasks: UserTask[]) => {
    const newStats = getGoalStats(tasks)
    const areEqual = areObjectsEqual(goal.stats, newStats)
    goal.stats = newStats
    if (!areEqual) {
      let goals = cloneDeep(model.goals)
      replaceItemInArray<UserGoal>(goal, goals, 'id', goal.id!)
      putUserGoals(constructUserGoalsKey(model.username), goals)
    }
    setModel({ ...model, selectedGoal: goal })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShowCharts = async () => {
    setModel({ ...model, isLoading: true, selectedGoal: undefined, barChart: undefined })
    const tasks = await getUserTasks(model.username)
    const goalsAndTasks = mapGoalTasks(model.goals, tasks)
    const inProg = filter(tasks, (e) => e.status !== 'completed')
    const comp = filter(tasks, (e) => e.status === 'completed').length
    const pastDue = filter(inProg, (e) => e.dueDate !== undefined && dayjs(e.dueDate).isBefore(dayjs())).length
    const barChart: BarChart = {
      colors: [CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent],
      labels: ['past due', 'in progress', 'completed'],
      numbers: [pastDue, inProg.length, comp],
    }
    setModel({ ...model, isLoading: false, barChart: barChart, selectedGoal: undefined, goalsAndTasks: goalsAndTasks })
  }

  const handleCloseCharts = () => {
    setModel({ ...model, barChart: undefined })
  }

  return (
    <Box>
      <Button id='goalDetailsLink' sx={{ display: 'none' }} />
      <ConfirmDeleteDialog
        show={model.showConfirmDeleteGoal}
        title={'confirm delete'}
        text={`Are you sure you want to delete ${model.selectedGoal?.body}?`}
        onConfirm={handleYesDeleteGoal}
        onCancel={() => {
          setModel({ ...model, showConfirmDeleteGoal: false })
        }}
      />
      <Box py={2}>
        {model.isLoading && (
          <>
            <WarmupBox />
            <BoxSkeleton height={100} />
            <HorizontalDivider />
            <BoxSkeleton height={100} />
            <HorizontalDivider />
            <BoxSkeleton height={100} />
            <HorizontalDivider />
            <BoxSkeleton height={100} />
          </>
        )}
        {model.barChart ? (
          <>
            <GoalCharts barChart={model.barChart} handleCloseCharts={handleCloseCharts} goalTasks={model.goalsAndTasks} />
          </>
        ) : (
          <Stack display={'flex'} direction={'row'} justifyContent={'left'} alignItems={'left'}>
            {!model.selectedGoal && !model.isLoading && (
              <Box>
                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  onClick={() => {
                    setModel({ ...model, showAddGoalForm: !model.showAddGoalForm })
                  }}>
                  {`${model.showAddGoalForm ? 'cancel' : 'create goal'}`}
                </Button>
              </Box>
            )}
            {!model.isLoading && (
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
                <GoalsMenu
                  onShowCharts={() => {
                    handleShowCharts()
                  }}
                />
              </Stack>
            )}
          </Stack>
        )}
        {model.showAddGoalForm && (
          <Box pt={1}>
            <AddGoalForm goal={{}} onSubmit={handleEditGoalSubmit} />
          </Box>
        )}
      </Box>
      <Box>
        {model.isLoading ? (
          <></>
        ) : (
          <>
            {!model.barChart && (
              <>
                {model.goals.length > 0 && !model.selectedGoal && (
                  <Stack direction='row' pt={2} pb={1} justifyContent='left' alignItems='left'>
                    <Typography textAlign={'left'} variant='body2'>
                      Goal
                    </Typography>
                    <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                      <Typography variant='body2'>Progress</Typography>
                    </Stack>
                  </Stack>
                )}
                <HorizontalDivider />
                {model.selectedGoal && (
                  <GoalDetails
                    model={model}
                    goalId={model.selectedGoal!.id!}
                    handleCloseSelectedGoal={handleCloseSelectedGoal}
                    handleDeleteGoal={handleDeleteGoal}
                    handleSetGoalEditMode={handleSetGoalEditMode}
                    handleModifyGoal={saveGoal}
                    onLoaded={handelGoalDetailsLoaded}
                  />
                )}
                <>
                  {!model.selectedGoal &&
                    model.goals.map((item, i) => (
                      <Box key={i}>
                        <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                          <LinkButton2
                            onClick={() => {
                              handleGoalClick(item)
                            }}>
                            <Typography>{item.body}</Typography>
                          </LinkButton2>
                          {item.completePercent !== undefined && (
                            <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                              <ProgressBar value={item.completePercent} toolTipText={`${item.completePercent}% complete`} width={80} />
                            </Stack>
                          )}
                        </Stack>
                        {item.stats && (
                          <Box pl={1}>
                            {item.stats && <Typography variant='body2'>{`tasks: ${Number(item.stats.completed) + Number(item.stats.inProgress)}`}</Typography>}
                            {item.stats && <Typography variant='body2'>{`completed: ${item.stats.completed}`}</Typography>}
                            {item.stats && <Typography variant='body2'>{`in progress: ${item.stats.inProgress}`}</Typography>}
                            {item.stats && item.stats.pastDue > 0 && (
                              <LinkButton2
                                onClick={() => {
                                  handleGoalClick(item)
                                }}>
                                <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${item.stats.pastDue}`}</Typography>
                              </LinkButton2>
                            )}
                          </Box>
                        )}
                        {i < model.goals.length - 1 && <HorizontalDivider />}
                      </Box>
                    ))}
                </>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
export default UserGoalsDisplay

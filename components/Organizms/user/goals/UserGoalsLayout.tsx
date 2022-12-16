import { Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserTasks, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'
import GoalDetails from './GoalDetails'
import MenuIcon from '@mui/icons-material/Menu'
import CachedIcon from '@mui/icons-material/Cached'
import BarChartIcon from '@mui/icons-material/BarChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { areObjectsEqual } from 'lib/util/objects'
import { replaceItemInArray } from 'lib/util/collections'
import GoalCharts from './GoalCharts'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'

export interface UserGoalAndTask {
  goal: UserGoal
  tasks: UserTask[]
}

export interface UserGoalsModel {
  isLoading: boolean
  isSaving: boolean
  selectedGoal?: UserGoal
  goals: UserGoal[]
  username: string
  goalEditMode: boolean
  showConfirmDeleteGoal: boolean
  showAddGoalForm: boolean
  barChart?: BarChart
  goalsAndTasks: UserGoalAndTask[]
}

const UserGoalsLayout = ({ username }: { username: string }) => {
  const defaultModel: UserGoalsModel = {
    goals: [],
    username: username,
    isLoading: true,
    goalEditMode: false,
    isSaving: false,
    showConfirmDeleteGoal: false,
    showAddGoalForm: false,
    goalsAndTasks: [],
  }
  const [model, setModel] = React.useReducer((state: UserGoalsModel, newState: UserGoalsModel) => ({ ...state, ...newState }), defaultModel)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const loadGoals = async () => {
    const goals = orderBy(await getUserGoals(constructUserGoalsKey(username)), ['dateModified'], ['desc'])
    const tasks = await getUserTasks(username)
    return mapGoalTasks(goals, tasks)
  }

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

  const handleEditGoalSubmit = async (item: UserGoal) => {
    setModel({ ...model, isLoading: true })
    let goals = cloneDeep(model).goals
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
    }
    item.dateModified = getUtcNow().format()
    goals.push(item)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, selectedGoal: undefined, isLoading: false, showAddGoalForm: false })
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

  const handleGoalBodyChange = (text: string) => {
    if (model.selectedGoal) {
      const goal = model.selectedGoal
      goal.body = text
      setModel({ ...model, selectedGoal: goal })
    }
  }
  const handleSetGoalEditMode = (isEdit: boolean) => {
    setModel({ ...model, goalEditMode: isEdit })
  }

  const saveGoal = async (goal: UserGoal) => {
    setModel({ ...model, isSaving: true, isLoading: true, selectedGoal: undefined })
    goal.dateModified = getUtcNow().format()
    let goals = filter(cloneDeep(model.goals), (e) => e.id !== goal!.id)
    goals.push(goal)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, isSaving: false, isLoading: false, goalEditMode: false, selectedGoal: goal })
  }

  const handleSubmitGoalChanges = async () => {
    let goal = cloneDeep(model.selectedGoal)
    if (goal) {
      await saveGoal(goal)
    }
  }
  const handleDueDateChange = async (text?: string) => {
    if (model.selectedGoal) {
      const goal = cloneDeep(model.selectedGoal)
      goal.dueDate = text
      setModel({ ...model, selectedGoal: goal })
    }
  }
  const handelGoalDetailsLoaded = async (goal: UserGoal, tasks: UserTask[]) => {
    const newStats = getGoalStats(tasks)
    const areEqual = areObjectsEqual(goal.stats, newStats)
    goal.stats = newStats
    if (!areEqual) {
      let goals = cloneDeep(model.goals)
      replaceItemInArray<UserGoal>(goal, goals, 'id', goal.id!)
      putUserGoals(constructUserGoalsKey(model.username), goals)
      console.log('replaced goal: ', goal.body)
    }

    setModel({ ...model, selectedGoal: goal })
    const div = document.getElementById('goalDetailsLink')
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleRefrehGoals = async () => {
    setModel({ ...model, isLoading: true })
    const goalsAndTasks = await loadGoals()
    const goals: UserGoal[] = goalsAndTasks.map((e) => e.goal)
    setModel({ ...model, goals: goals, goalEditMode: false, selectedGoal: undefined, barChart: undefined, goalsAndTasks: goalsAndTasks })
  }

  const handleShowCharts = async () => {
    setModel({ ...model, isLoading: true })
    const tasks = await getUserTasks(model.username)
    const goalsAndTasks = mapGoalTasks(model.goals, tasks)
    const inProg = filter(tasks, (e) => e.status !== 'completed')
    const comp = filter(tasks, (e) => e.status === 'completed').length
    const pastDue = filter(inProg, (e) => e.dueDate !== undefined && dayjs(e.dueDate).isBefore(dayjs())).length
    const barChart: BarChart = {
      colors: [CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent],
      labels: ['past due', 'in progress', 'completed'],
      numbers: [pastDue, inProg.length, comp],
      //borderColors: [CasinoRed, CasinoBlue, CasinoGreen],
    }
    setModel({ ...model, isLoading: false, barChart: barChart, selectedGoal: undefined, goalsAndTasks: goalsAndTasks })
  }

  const handleCloseCharts = () => {
    setModel({ ...model, barChart: undefined })
  }

  React.useEffect(() => {
    const fn = async () => {
      const goalsAndTasks = await loadGoals()
      const goals: UserGoal[] = goalsAndTasks.map((e) => e.goal)
      setModel({ ...model, goals: goals, isLoading: false, goalsAndTasks: goalsAndTasks })
    }
    fn()
  }, [])

  return (
    <Box>
      <ConfirmDeleteDialog
        show={model.showConfirmDeleteGoal}
        title={'confirm delete'}
        text={`Are you sure you want to delete goal: ${model.selectedGoal?.body}?`}
        onConfirm={handleYesDeleteGoal}
        onCancel={() => {
          setModel({ ...model, showConfirmDeleteGoal: false })
        }}
      />
      <Box py={2}>
        {model.barChart ? (
          <GoalCharts barChart={model.barChart} handleCloseCharts={handleCloseCharts} goalTasks={model.goalsAndTasks} />
        ) : (
          <Stack display={'flex'} direction={'row'} justifyContent={'left'} alignItems={'left'}>
            <Box>
              <LinkButton
                onClick={() => {
                  setModel({ ...model, showAddGoalForm: !model.showAddGoalForm })
                }}
              >
                <Typography>{`${model.showAddGoalForm ? 'cancel' : 'create goal'}`}</Typography>
              </LinkButton>
            </Box>
            <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
              <GoalsMenu
                onRefresh={() => {
                  handleCloseMenu()
                  handleRefrehGoals()
                }}
                onShowCharts={() => {
                  handleCloseMenu()
                  handleShowCharts()
                }}
              />
            </Stack>
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
          <PageWithGridSkeleton />
        ) : (
          !model.barChart && (
            <>
              {model.goals.length > 0 && (
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
              {model.goals.map((item, i) => (
                <Box key={i}>
                  <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                    <LinkButton2
                      id={model.selectedGoal && model.selectedGoal.id === item.id ? 'goalDetailsLink' : undefined}
                      onClick={() => {
                        handleGoalClick(item)
                      }}
                    >
                      <Typography textAlign={'left'} variant='subtitle1'>
                        {item.body}
                      </Typography>
                    </LinkButton2>
                    {item.completePercent !== undefined && (
                      <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                        <ProgressBar value={item.completePercent} toolTipText={`${item.completePercent}% complete`} width={80} />
                      </Stack>
                    )}
                  </Stack>
                  {item.dueDate && <Typography variant='body2'>{`due: ${dayjs(item.dueDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>}
                  {item.stats && <Typography variant='body2'>{`completed: ${item.stats.completed}`}</Typography>}
                  {item.stats && <Typography variant='body2'>{`in progress: ${item.stats.inProgress}`}</Typography>}
                  {item.stats && item.stats.pastDue > 0 && (
                    <LinkButton2
                      onClick={() => {
                        handleGoalClick(item)
                      }}
                    >
                      <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${item.stats.pastDue}`}</Typography>
                    </LinkButton2>
                  )}
                  {model.selectedGoal && model.selectedGoal.id === item.id && (
                    <>
                      <Button id='goalDetailsStart' sx={{ display: 'none' }}></Button>
                      <GoalDetails
                        model={model}
                        goalId={item.id!}
                        handleGoalBodyChange={handleGoalBodyChange}
                        handleCloseSelectedGoal={handleCloseSelectedGoal}
                        handleDeleteGoal={handleDeleteGoal}
                        handleDueDateChange={handleDueDateChange}
                        handleSubmitGoalChanges={handleSubmitGoalChanges}
                        handleSetGoalEditMode={handleSetGoalEditMode}
                        handleModifyGoal={saveGoal}
                        onLoaded={handelGoalDetailsLoaded}
                      />
                    </>
                  )}
                  {i < model.goals.length - 1 && <HorizontalDivider />}
                </Box>
              ))}
            </>
          )
        )}
      </Box>
    </Box>
  )
}

export default UserGoalsLayout

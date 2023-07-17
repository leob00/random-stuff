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
import { getUtcNow, getSecondsFromEpoch } from 'lib/util/dateUtil'
import { cloneDeep, orderBy, filter } from 'lodash'
import React from 'react'
import GoalCharts from './GoalCharts'
import { UserGoalAndTask, UserGoalsModel } from './UserGoalsLayout'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import router from 'next/router'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
const mapGoalTasks = (goals: UserGoal[], tasks: UserTask[]) => {
  const goalsAndTasks: UserGoalAndTask[] = []
  const goalsCopy = [...goals]
  goalsCopy.forEach((goal) => {
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
const UserGoalsDisplay = ({
  goals,
  tasks,
  username,
  onMutated,
}: {
  goals: UserGoal[]
  tasks: UserTask[]
  username: string
  onMutated: (newData: UserGoal[]) => void
}) => {
  const goalsAndTasks = mapGoalTasks(goals, tasks)
  const [barChart, setBarchart] = React.useState<BarChart | undefined>(undefined)
  const [showAddGoalForm, setShowAddGoalForm] = React.useState(false)
  //const [model, setModel] = React.useReducer((state: UserGoalsModel, newState: UserGoalsModel) => ({ ...state, ...newState }), defaultModel)

  const handleEditGoalSubmit = async (item: UserGoal) => {
    // setModel({ ...model, showAddGoalForm: false, goalsAndTasks: [], goals: [] })
    let newGoals = [...goals]
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
    }
    item.dateModified = getUtcNow().format()
    newGoals.push(item)
    newGoals = orderBy(newGoals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    //setModel({ ...model, goals: goals, selectedGoal: newGoal ? item : undefined, isLoading: false, showAddGoalForm: false })
    onMutated(goals)
    await handleGoalClick(item)
  }

  const handleGoalClick = async (item: UserGoal) => {
    //setModel({ ...model, showAddGoalForm: false, goalsAndTasks: [], goals: [] })
    const goalId = encodeURIComponent(weakEncrypt(item.id!))
    const token = encodeURIComponent(weakEncrypt(username))
    router.push(`/protected/csr/goals/details?id=${goalId}&token=${token}`)
  }

  const handleShowCharts = async () => {
    //setModel({ ...model, barChart: undefined })
    //const tasks = await getUserTasks(model.username)
    //const goalsAndTasks = mapGoalTasks(model.goals, tasks)
    const inProg = filter(tasks, (e) => e.status !== 'completed')
    const comp = filter(tasks, (e) => e.status === 'completed').length
    const pastDue = filter(inProg, (e) => e.dueDate !== undefined && dayjs(e.dueDate).isBefore(dayjs())).length
    const barChart: BarChart = {
      colors: [CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent],
      labels: ['past due', 'in progress', 'completed'],
      numbers: [pastDue, inProg.length, comp],
    }
    setBarchart(barChart)
    //setModel({ ...model, barChart: barChart, goalsAndTasks: goalsAndTasks })
  }

  const handleCloseCharts = () => {
    setBarchart(undefined)
  }

  return (
    <Box>
      <Box py={2}>
        {barChart ? (
          <>
            <GoalCharts barChart={barChart} handleCloseCharts={handleCloseCharts} goalTasks={goalsAndTasks} />
          </>
        ) : (
          <Stack display={'flex'} direction={'row'} justifyContent={'left'} alignItems={'left'}>
            <Box>
              <Button variant='contained' size='small' color='secondary' onClick={() => setShowAddGoalForm(!showAddGoalForm)}>
                {`${showAddGoalForm ? 'cancel' : 'create goal'}`}
              </Button>
            </Box>
            <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
              <GoalsMenu
                onShowCharts={() => {
                  handleShowCharts()
                }}
              />
            </Stack>
          </Stack>
        )}
        {showAddGoalForm && (
          <Box pt={1}>
            <AddGoalForm goal={{}} onSubmit={handleEditGoalSubmit} />
          </Box>
        )}
      </Box>
      <Box>
        <>
          {!barChart && (
            <>
              {goals.length > 0 && (
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

              <>
                {goals.map((item, i) => (
                  <Box key={i}>
                    <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                      <LinkButton2
                        onClick={() => {
                          handleGoalClick(item)
                        }}
                      >
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
                            }}
                          >
                            <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${item.stats.pastDue}`}</Typography>
                          </LinkButton2>
                        )}
                      </Box>
                    )}

                    {i < goals.length - 1 && <HorizontalDivider />}
                  </Box>
                ))}
              </>
            </>
          )}
        </>
      </Box>
    </Box>
  )
}
export default UserGoalsDisplay

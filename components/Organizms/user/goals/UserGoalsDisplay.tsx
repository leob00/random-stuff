import { Box, Button, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import { CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { putUserGoals } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { orderBy, filter } from 'lodash'
import React from 'react'
import GoalCharts from './GoalCharts'
import { UserGoalAndTask } from './UserGoalsLayout'
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

  const handleEditGoalSubmit = async (item: UserGoal) => {
    let newGoals = [...goals]
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
    }
    item.dateModified = getUtcNow().format()
    newGoals.push(item)
    newGoals = orderBy(newGoals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    //onMutated(goals)
    await handleGoalClick(item)
  }

  const handleGoalClick = async (item: UserGoal) => {
    const goalId = encodeURIComponent(weakEncrypt(item.id!))
    const token = encodeURIComponent(weakEncrypt(username))
    router.push(`/protected/csr/goals/details?id=${goalId}&token=${token}`)
  }

  const handleShowCharts = async () => {
    const inProg = filter(tasks, (e) => e.status !== 'completed')
    const comp = filter(tasks, (e) => e.status === 'completed').length
    const pastDue = filter(inProg, (e) => e.dueDate !== undefined && dayjs(e.dueDate).isBefore(dayjs())).length
    const barChart: BarChart = {
      colors: [CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent],
      labels: ['past due', 'in progress', 'completed'],
      numbers: [pastDue, inProg.length, comp],
    }
    setBarchart(barChart)
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
              <GoalsMenu onShowCharts={handleShowCharts} />
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

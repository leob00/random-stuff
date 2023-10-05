import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import { CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent, RedDarkMode } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { putUserGoals } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { iteratee, orderBy } from 'lodash'
import React from 'react'
import GoalCharts from './GoalCharts'
import { UserGoalAndTask } from './UserGoalsLayout'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import router from 'next/router'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import OverdueTasks from './OverdueTasks'
import GoalsSummary from './GoalsSummary'

const UserGoalsDisplay = ({ goalsAndTasks, username }: { goalsAndTasks: UserGoalAndTask[]; username: string }) => {
  // recover goals
  // if (goals.length === 0 && tasks.length > 0) {
  //   const newGoals: UserGoal[] = []
  //   tasks.forEach((t) => {
  //     if (!newGoals.find((m) => m.id === t.goalId)) {
  //       newGoals.push({
  //         id: t.goalId,
  //         body: t.goalId,
  //       })
  //     }
  //   })
  //   console.log('new goals: ', newGoals)
  //   putUserGoals(constructUserGoalsKey('leo_bel@hotmail.com'), newGoals)
  // }
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent

  //const goalsAndTasks = mapGoalTasks(goals, tasks)
  const [barChart, setBarchart] = React.useState<BarChart | undefined>(undefined)
  const [showAddGoalForm, setShowAddGoalForm] = React.useState(false)
  const allGoals = goalsAndTasks.flatMap((m) => m.goal)

  const handleAddGoal = async (item: UserGoal) => {
    let newGoals = goalsAndTasks.flatMap((m) => m.goal)
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
      item.stats = getGoalStats([])
    }
    item.dateModified = getUtcNow().format()
    newGoals.push(item)
    newGoals = orderBy(newGoals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(username), newGoals)
    //onMutated(goals)
    await handleShowEditGoal(item)
  }

  const handleShowEditGoal = async (item: UserGoal) => {
    const goalId = encodeURIComponent(weakEncrypt(item.id!))
    const token = encodeURIComponent(weakEncrypt(username))
    router.push(`/protected/csr/goals/details?id=${goalId}&token=${token}`)
  }

  const handleShowCharts = async () => {
    const tasks = goalsAndTasks.flatMap((m) => m.tasks)
    const inProg = tasks.filter((e) => e.status !== 'completed')
    const comp = tasks.filter((e) => e.status === 'completed').length
    const pastDue = inProg.filter((e) => e.dueDate !== undefined && dayjs(e.dueDate).isBefore(dayjs())).length
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
            <GoalsSummary barChart={barChart} goalTasks={goalsAndTasks} username={username} handleCloseSummary={handleCloseCharts} />
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
            <AddGoalForm goal={{}} onSubmit={handleAddGoal} />
          </Box>
        )}
      </Box>
      <Box>
        <>
          {!barChart && (
            <>
              {allGoals.length > 0 && (
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
                {allGoals.map((item, i) => (
                  <Box key={item.id}>
                    <ListItemContainer>
                      <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left' pl={2} pt={1}>
                        {/* <ListHeader text={item.body!} item={item} onClicked={handleShowEditGoal} /> */}
                        <LinkButton2 onClick={() => handleShowEditGoal(item)}>
                          <Typography>{item.body}</Typography>
                        </LinkButton2>

                        {item.completePercent !== undefined && (
                          <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'} pr={2}>
                            <ProgressBar value={item.completePercent} toolTipText={`${item.completePercent}% complete`} width={80} />
                          </Stack>
                        )}
                      </Stack>
                      {item.stats && (
                        <Box pl={3} pb={2}>
                          <>
                            <Box>
                              <Typography variant='body2'>{`tasks: ${Number(item.stats.completed) + Number(item.stats.inProgress)}`}</Typography>
                              <Typography variant='body2'>{`completed: ${item.stats.completed}`}</Typography>
                              <Typography variant='body2'>{`in progress: ${item.stats.inProgress}`}</Typography>
                            </Box>
                            {item.stats.pastDue > 0 && <Typography variant='body2' color={redColor}>{`past due: ${item.stats.pastDue}`}</Typography>}
                          </>
                        </Box>
                      )}
                    </ListItemContainer>
                    {i < allGoals.length - 1 && <HorizontalDivider />}
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

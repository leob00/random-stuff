import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import { CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent, RedDarkMode } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { putUserGoals } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import { orderBy } from 'lodash'
import React from 'react'
import { UserGoalAndTask } from './UserGoalsLayout'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import router from 'next/router'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import GoalsSummary from 'components/Organizms/user/goals/GoalsSummary'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'

const UserGoalsDisplay = ({ goalsAndTasks, username }: { goalsAndTasks: UserGoalAndTask[]; username: string }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent

  const [barChart, setBarchart] = React.useState<BarChart | undefined>(undefined)
  const [showAddGoalForm, setShowAddGoalForm] = React.useState(false)
  const [searchWithinList, setSearchWithinList] = React.useState('')
  const allGoals = goalsAndTasks.flatMap((m) => m.goal)
  const goalsKey = constructUserGoalsKey(username)

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
    await putUserGoals(goalsKey, newGoals)
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
  const filterGoals = () => {
    if (searchWithinList.length > 0) {
      return allGoals.filter((m) => m.body!.toLowerCase().startsWith(searchWithinList.toLowerCase()))
    }
    return allGoals
  }
  const filteredGoals = filterGoals()

  return (
    <Box>
      <Box py={2}>
        {barChart ? (
          <>
            <GoalsSummary barChart={barChart} goalTasks={goalsAndTasks} username={username} handleCloseSummary={handleCloseCharts} />
          </>
        ) : (
          <Stack display={'flex'} direction={'row'} gap={2} alignItems={'center'}>
            <Box>
              <PrimaryButton text={`new goal`} onClick={() => setShowAddGoalForm(true)}></PrimaryButton>
            </Box>
            <SearchWithinList text='search...' onChanged={(text: string) => setSearchWithinList(text)} />
            <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
              <GoalsMenu onShowCharts={handleShowCharts} />
            </Stack>
          </Stack>
        )}
        <FormDialog show={showAddGoalForm} title='add a new goal' onCancel={() => setShowAddGoalForm(false)}>
          <AddGoalForm goal={{}} onSubmit={handleAddGoal} />
        </FormDialog>
      </Box>
      <Box>
        <>
          {!barChart && (
            <>
              {filteredGoals.map((item, i) => (
                <Box key={item.id}>
                  <Box>
                    <GradientContainer>
                      <Stack
                        direction='row'
                        py={'3px'}
                        justifyContent='left'
                        alignItems='center'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleShowEditGoal(item)}
                      >
                        <Button size='large'>{item.body}</Button>
                        {item.completePercent !== undefined && (
                          <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' pr={2}>
                            <ProgressBar value={item.completePercent} toolTipText={`${item.completePercent}% complete`} width={80} />
                          </Stack>
                        )}
                      </Stack>
                    </GradientContainer>
                    {item.stats && (
                      <Box pl={2} pb={2}>
                        <>
                          <Box>
                            <ReadOnlyField label={`tasks`} val={`${Number(item.stats.completed) + Number(item.stats.inProgress)}`} />
                            <ReadOnlyField label={`completed`} val={`${item.stats.completed}`} />
                            <ReadOnlyField label={`in progress`} val={`${item.stats.inProgress}`} />
                          </Box>
                          {item.stats.pastDue > 0 && <Typography variant='body2' pt={1} color={redColor}>{`past due: ${item.stats.pastDue}`}</Typography>}
                        </>
                      </Box>
                    )}
                  </Box>
                  {/* </ListItemContainer> */}
                  {i < filteredGoals.length - 1 && <HorizontalDivider />}
                </Box>
              ))}
            </>
          )}
        </>
      </Box>
    </Box>
  )
}
export default UserGoalsDisplay

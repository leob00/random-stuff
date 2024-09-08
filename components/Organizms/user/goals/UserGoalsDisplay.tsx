import { Box, Stack, useTheme } from '@mui/material'
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
import GoalsSummary from 'components/Organizms/user/goals/GoalsSummary'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import UserGoalsList from './UserGoalsList'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'

const UserGoalsDisplay = ({ goalsAndTasks, username, onRefresh }: { goalsAndTasks: UserGoalAndTask[]; username: string; onRefresh: () => void }) => {
  const [summaryChart, setSummaryChart] = React.useState<BarChart | undefined>(undefined)
  const [showAddGoalForm, setShowAddGoalForm] = React.useState(false)
  const [searchWithinList, setSearchWithinList] = React.useState('')
  const allGoals = goalsAndTasks.flatMap((m) => m.goal)
  const goalsKey = constructUserGoalsKey(username)

  const goalsAutoComplete: DropdownItem[] = allGoals.map((m) => {
    return {
      text: m.body ?? '',
      value: m.id ?? '',
    }
  })

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
  const handleShowAddGoalForm = () => {
    setShowAddGoalForm(true)
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
    setSummaryChart(barChart)
  }

  const handleCloseCharts = () => {
    setSummaryChart(undefined)
  }

  const filterGoals = () => {
    if (searchWithinList.length > 0) {
      return allGoals.filter((m) => m.body!.toLowerCase().startsWith(searchWithinList.toLowerCase()))
    }
    return allGoals
  }
  const handleSelectGoal = (item: DropdownItem) => {
    const g = allGoals.find((m) => m.id == item.value)
    if (g) {
      handleShowEditGoal(g)
    }
  }

  const filteredGoals = filterGoals()

  return (
    <Box>
      <Box py={2}>
        {summaryChart ? (
          <>
            <GoalsSummary barChart={summaryChart} goalTasks={goalsAndTasks} username={username} handleCloseSummary={handleCloseCharts} />
          </>
        ) : (
          <>
            {goalsAndTasks.length == 0 ? (
              <Box py={4}>
                <PrimaryButton text={`add a goal`} onClick={handleShowAddGoalForm}></PrimaryButton>
              </Box>
            ) : (
              <Stack display={'flex'} direction={'row'} gap={2} alignItems={'center'}>
                <StaticAutoComplete options={goalsAutoComplete} onSelected={handleSelectGoal} placeholder={`search ${goalsAndTasks.length} goals`} />
                <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
                  <GoalsMenu onShowCharts={handleShowCharts} onAddGoal={handleShowAddGoalForm} onRefresh={onRefresh} />
                </Stack>
              </Stack>
            )}
          </>
        )}
        <FormDialog show={showAddGoalForm} title='add a new goal' onCancel={() => setShowAddGoalForm(false)}>
          <AddGoalForm goal={{}} onSubmit={handleAddGoal} />
        </FormDialog>
      </Box>
      <Box>{!summaryChart && <UserGoalsList data={filteredGoals} onShowEdit={handleShowEditGoal} />}</Box>
    </Box>
  )
}
export default UserGoalsDisplay

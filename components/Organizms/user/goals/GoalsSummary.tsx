import { Box, Stack, Button } from '@mui/material'
import Close from '@mui/icons-material/Close'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import GoalCharts from './GoalCharts'
import OverdueTasks from './OverdueTasks'
import { UserGoalAndTask } from './UserGoalsLayout'

const GoalsSummary = ({
  barChart,
  goalTasks,
  username,
  handleCloseSummary,
}: {
  barChart: BarChart
  username: string
  goalTasks: UserGoalAndTask[]
  handleCloseSummary: () => void
}) => {
  return (
    <>
      <Box pt={2}>
        <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
          <Button onClick={handleCloseSummary}>
            <Close />
          </Button>
        </Stack>
      </Box>
      <OverdueTasks goalsAndTasks={goalTasks} username={username} />
      <GoalCharts barChart={barChart} goalTasks={goalTasks} />
    </>
  )
}

export default GoalsSummary

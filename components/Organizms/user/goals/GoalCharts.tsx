import { Box, Grid, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ApexPieChart from 'components/Molecules/Charts/apex/ApexPieChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { sum } from 'lodash'
import numeral from 'numeral'
import GoalsBarChartByStatus from './GoalBarChartByCompleted'
import { UserGoalAndTask } from './UserGoalsLayout'

const GoalCharts = ({ barChart, goalTasks }: { barChart: BarChart; goalTasks: UserGoalAndTask[] }) => {
  const theme = useTheme()
  return (
    <>
      <Box pb={2}>
        <CenteredTitle title={`Goal Completion`} />
        <GoalsBarChartByStatus goalTasks={goalTasks} />
        <HorizontalDivider />
        <CenteredTitle title={`All ${numeral(sum(barChart.numbers)).format('###,###')} Tasks By Status`} />
        <Box minHeight={200}>
          <ApexPieChart x={barChart.labels} y={barChart.numbers} colors={barChart.colors} palette={theme.palette.mode} />
        </Box>
      </Box>
    </>
  )
}

export default GoalCharts

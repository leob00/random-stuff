import { Box, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ApexPieChart from 'components/Atoms/Charts/apex/ApexPieChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { sum } from 'lodash'
import numeral from 'numeral'
import { UserGoalAndTask } from './UserGoalsLayout'
import GoalsBarChartByStatus from './GoalBarChartByCompleted'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'

const GoalCharts = ({ barChart, goalTasks }: { barChart: BarChart; goalTasks: UserGoalAndTask[] }) => {
  return (
    <>
      <Box pb={2}>
        <CenteredTitle title={`Goal Completion`} />
        <Box>
          <GoalsBarChartByStatus goalTasks={goalTasks} />
        </Box>
        <HorizontalDivider />
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt={3}>
          <Box>
            <BasicPieChart barChart={barChart} title={`${numeral(sum(barChart.numbers)).format('###,###')} Tasks By Status`} />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default GoalCharts

import Close from '@mui/icons-material/Close'
import { Box, Button, Grid, Stack, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ApexPieChart from 'components/Molecules/Charts/apex/ApexPieChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { sum } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import GoalsBarChartByStatus from './GoalBarChartByCompleted'
import { UserGoalAndTask } from './UserGoalsLayout'

const GoalCharts = ({ barChart, goalTasks }: { barChart: BarChart; goalTasks: UserGoalAndTask[] }) => {
  const theme = useTheme()
  return (
    <>
      <Box pb={2}>
        <CenteredTitle title={`Goal Completion`} />
        <GoalsBarChartByStatus goalTasks={goalTasks} />
        {/* <Box pb={2}>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={10}>
              <Box></Box>
            </Grid>
          </Grid>
        </Box> */}
        <HorizontalDivider />
        <CenteredTitle title={`All ${numeral(sum(barChart.numbers)).format('###,###')} Tasks By Status`} />
        <Box minHeight={200}>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={6}>
              <ApexPieChart x={barChart.labels} y={barChart.numbers} colors={barChart.colors} palette={theme.palette.mode} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default GoalCharts

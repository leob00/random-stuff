import Close from '@mui/icons-material/Close'
import { Box, Button, Grid, Stack, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ApexPieChart from 'components/Molecules/Charts/apex/ApexPieChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { sum } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import GoalsBarChartByStatus from './GoalBarChartByCompleted'
import { UserGoalAndTask } from './UserGoalsLayout'

const GoalCharts = ({ barChart, goalTasks, handleCloseCharts }: { barChart: BarChart; goalTasks: UserGoalAndTask[]; handleCloseCharts: () => void }) => {
  const theme = useTheme()
  return (
    <>
      <Box py={2}>
        <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
          <Button onClick={handleCloseCharts}>
            <Close />
          </Button>
        </Stack>
        <CenteredTitle title={`Goals by Progress`} />
        <Box pb={2} minHeight={200}>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={8}>
              <Box>
                <GoalsBarChartByStatus goalTasks={goalTasks} />
              </Box>
            </Grid>
          </Grid>
        </Box>
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

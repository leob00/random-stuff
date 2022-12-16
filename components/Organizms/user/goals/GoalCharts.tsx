import { Close } from '@mui/icons-material'
import { Box, Button, Grid, Stack } from '@mui/material'
import BasicBarChart from 'components/Atoms/Charts/BasicBarChart'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ApexBarChart, { ApexBarChartData } from 'components/Molecules/Charts/apex/ApexBarChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { CasinoRedTransparent, CasinoBlueTransparent, CasinoGreenTransparent, CasinoGreen } from 'components/themes/mainTheme'
import { filter, orderBy, sum } from 'lodash'
import numeral from 'numeral'
import React from 'react'
import { UserGoalAndTask } from './UserGoalsLayout'

const GoalCharts = ({ barChart, goalTasks, handleCloseCharts }: { barChart: BarChart; goalTasks: UserGoalAndTask[]; handleCloseCharts: () => void }) => {
  let data: ApexBarChartData[] = []
  const gt = orderBy(goalTasks, (e) => e.goal.completePercent, ['desc'])

  const getFillColor = (num?: number) => {
    if (!num) {
      return CasinoBlueTransparent
    }
    if (num === 100) {
      return CasinoGreenTransparent
    }
    if (num < 50) {
      return CasinoRedTransparent
    }
    return CasinoBlueTransparent
  }

  data = gt.map((e) => {
    return {
      x: e.goal.body!,
      y: e.goal.completePercent!,
      fillColor: getFillColor(e.goal.completePercent),
    }
  })

  return (
    <>
      <Box py={2}>
        <HorizontalDivider />
        <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
          <Button onClick={handleCloseCharts}>
            <Close />
          </Button>
        </Stack>
        <CenteredTitle title={`Goals by Progress`} />
        <Box pb={2}>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={10}>
              <Box>
                <ApexBarChart data={data} horizontal seriesName='completed' yAxisDecorator='%' />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <CenteredTitle title={`All ${numeral(sum(barChart.numbers)).format('###,###')} Tasks By Status`} />
        <Box>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={4}>
              <Box>
                <BasicPieChart barChart={barChart} title={''} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box>
                <BasicBarChart barChart={barChart} title={''} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default GoalCharts

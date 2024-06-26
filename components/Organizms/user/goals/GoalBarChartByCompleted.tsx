import ApexBarChart from 'components/Molecules/Charts/apex/ApexBarChart'
import { ApexBarChartData } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { orderBy } from 'lodash'
import React from 'react'
import { UserGoalAndTask } from './UserGoalsLayout'
import { Box, useTheme } from '@mui/material'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'

const GoalsBarChartByStatus = ({ goalTasks }: { goalTasks: UserGoalAndTask[] }) => {
  const theme = useTheme()
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
  const barChart: BarChart = {
    colors: data.map((m) => m.fillColor),
    labels: data.map((m) => m.x),
    numbers: data.map((m) => m.y),
  }

  return (
    <Box>
      <SimpleBarChart2 title='' barChart={barChart} yAxisDecorator='%' isHorizontal />
      {/* <ApexBarChart data={data} horizontal seriesName='completed' yAxisDecorator='%' palette={theme.palette.mode} /> */}
    </Box>
  )
}

export default GoalsBarChartByStatus

import ApexBarChart from 'components/Molecules/Charts/apex/ApexBarChart'
import { ApexBarChartData } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { orderBy } from 'lodash'
import React from 'react'
import { UserGoalAndTask } from './UserGoalsLayout'
import { useTheme } from '@mui/material'

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
  return <ApexBarChart data={data} horizontal seriesName='completed' yAxisDecorator='%' palette={theme.palette.mode} />
}

export default GoalsBarChartByStatus

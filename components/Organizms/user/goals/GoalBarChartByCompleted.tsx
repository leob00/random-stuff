import { ApexBarChartData } from 'components/Atoms/Charts/apex/chartModels'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { orderBy } from 'lodash'
import { UserGoalAndTask } from './UserGoalsLayout'
import { Box } from '@mui/material'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'

const GoalsBarChartByStatus = ({ goalTasks }: { goalTasks: UserGoalAndTask[] }) => {
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
      <SimpleBarChart title='' barChart={barChart} yAxisDecorator='%' isHorizontal />
    </Box>
  )
}

export default GoalsBarChartByStatus

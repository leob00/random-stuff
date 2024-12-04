import { ApexBarChartData } from 'components/Atoms/Charts/apex/chartModels'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { orderBy } from 'lodash'
import { UserGoalAndTask } from './UserGoalsLayout'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'

const GoalsBarChartByStatus = ({ goalTasks }: { goalTasks: UserGoalAndTask[] }) => {
  let data: ApexBarChartData[] = []
  const gt = orderBy(goalTasks, (e) => e.goal.completePercent, ['desc'])
  const theme = useTheme()
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
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))

  let height: number | undefined = undefined
  if (isXSmall) {
    height = 240
  }
  if (isLarge) {
    height = 320
  }

  return (
    <Box>
      <SimpleBarChart title='' barChart={barChart} yAxisDecorator='%' isHorizontal height={height} />
    </Box>
  )
}

export default GoalsBarChartByStatus

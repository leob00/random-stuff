import { Box, useMediaQuery, useTheme } from '@mui/material'
import SimpleBarChart2 from 'components/Atoms/Charts/chartJs/SimpleBarChart2'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlue, CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { JoBLog, Job } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import { mean, take } from 'lodash'

const JobPerformanceBarChart = ({ data }: { data: Job }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))
  const history = data.Chart?.RawData as JoBLog[]
  const limit = isXSmall ? 100 : 250
  let height: number | undefined = undefined
  if (isXSmall) {
    height = 400
  }
  if (isLarge) {
    height = 100
  }
  let sorted = take(sortArray(history, ['DateCompleted'], ['desc']), limit)

  sorted = sortArray(sorted, ['DateCompleted'], ['asc'])
  const days = new Set(sorted.map((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY')))

  const barChart: BarChart = {
    colors: [],
    labels: [],
    numbers: [],
  }
  days.forEach((day) => {
    const d = sorted.filter((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY') === day)
    if (d.length > 0) {
      const avgMinutes = mean(d.map((m) => m.TotalMinutes))
      barChart.numbers.push(avgMinutes)
      barChart.labels.push(day)
      barChart.colors.push(CasinoBlueTransparent)
    }
  })

  return (
    <Box>
      <Box minHeight={200}>
        <SimpleBarChart2 title='performance in minutes' barChart={barChart} yAxisDecorator='' height={height} />
      </Box>
    </Box>
  )
}

export default JobPerformanceBarChart

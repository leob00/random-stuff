import { Box, useMediaQuery, useTheme } from '@mui/material'
import SimpleBarChart2 from 'components/Atoms/Charts/chartJs/SimpleBarChart2'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlue } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { JoBLog, Job } from 'lib/backend/api/qln/qlnApi'
import { mean, take } from 'lodash'

const JobPerformanceBarChart = ({ data }: { data: Job }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const history = data.Chart?.RawData as JoBLog[]
  const limit = isXSmall ? 25 : 1000

  var days = new Set(history.map((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY')))
  let values: number[] = []

  days.forEach((day) => {
    const d = history.filter((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY') === day)
    if (d.length > 0) {
      const avgMinutes = mean(d.map((m) => m.TotalMinutes))
      values.push(avgMinutes)
    }
  })
  const labels = Array.from(days)
  const colors = labels.map((m) => {
    return CasinoBlue
  })
  const barChart: BarChart = {
    colors: take(colors, limit),
    labels: take(labels, limit),
    numbers: take(values, limit),
  }
  return (
    <Box>
      <Box minHeight={200}>
        <SimpleBarChart2 title='performance in minutes' barChart={barChart} yAxisDecorator='' />
      </Box>
    </Box>
  )
}

export default JobPerformanceBarChart

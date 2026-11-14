import { Box, useMediaQuery, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { JoBLog, Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from 'components/Organizms/stocks/charts/ChartJsTimeSeriesLineChart'

const JobPerformanceLineChart = ({ data }: { data: Job }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const history = (data.Chart?.RawData as JoBLog[] | undefined) ?? []
  if (history.length === 0) {
    return null
  }

  const dailyTotals = new Map<string, { totalMinutes: number; recordsProcessed: number; runCount: number; lastCompleted: string }>()
  let totalMinutes = 0

  history.forEach((log) => {
    const day = dayjs(log.DateCompleted).format('YYYY-MM-DD')
    const dailyTotal = dailyTotals.get(day) ?? {
      totalMinutes: 0,
      recordsProcessed: 0,
      runCount: 0,
      lastCompleted: log.DateCompleted,
    }
    dailyTotal.totalMinutes += log.TotalMinutes
    dailyTotal.recordsProcessed += log.RecordsProcessed
    dailyTotal.runCount += 1
    if (dayjs(log.DateCompleted).isAfter(dayjs(dailyTotal.lastCompleted))) {
      dailyTotal.lastCompleted = log.DateCompleted
    }
    dailyTotals.set(day, dailyTotal)
    totalMinutes += log.TotalMinutes
  })

  const days = [...dailyTotals.keys()].sort().slice(-30)
  const dailyStats = days.map((day) => dailyTotals.get(day)!)

  const lineChart: BarChart = {
    colors: [],
    labels: [],
    numbers: [],
  }
  let minutesOrSeconds: 'minutes' | 'seconds' = 'minutes'
  const allMinutesAvg = history.length > 0 ? totalMinutes / history.length : 0
  if (allMinutesAvg < 1) {
    minutesOrSeconds = 'seconds'
  }
  days.forEach((day, index) => {
    const dailyTotal = dailyStats[index]
    const avgMinutes = dailyTotal.totalMinutes / dailyTotal.runCount
    lineChart.numbers.push(minutesOrSeconds === 'seconds' ? avgMinutes * 60 : avgMinutes)
    lineChart.labels.push(dayjs(day).format('MM/DD/YYYY'))
    lineChart.colors!.push(CasinoBlueTransparent)
  })

  const options = getLineChartOptions(
    { labels: lineChart.labels, numbers: lineChart.numbers },
    `Job performance`,
    minutesOrSeconds,
    theme.palette.mode,
    false,
    isXSmall,
  )
  options.scales!.y!.ticks!.callback = (value) => {
    if (minutesOrSeconds === 'seconds') {
      if (Number(value) > 60) {
        return `${numeral(Number(value) / 60).format('0.00')} minutes`
      } else {
        return `${value} seconds`
      }
    }
    return value
  }
  options.plugins!.tooltip!.callbacks = {
    ...options.plugins!.tooltip?.callbacks,
    title: (tooltipItems) => {
      return dayjs(days[tooltipItems[0].dataIndex]).format('dddd, MMMM D, YYYY')
    },
    label: (tooltipItems) => {
      const duration = Number(tooltipItems.formattedValue)
      if (minutesOrSeconds === 'seconds' && duration > 60) {
        return ` average: ${numeral(duration / 60).format('0.00')} minutes`
      }
      return ` average: ${numeral(duration).format('0.00')} ${minutesOrSeconds}`
    },
    footer: (tooltipItems) => {
      const dailyTotal = dailyStats[tooltipItems[0].dataIndex]
      return ` records processed: ${numeral(dailyTotal.recordsProcessed).format('###,###')} across ${dailyTotal.runCount} runs`
    },
    afterFooter: (tooltipItems) => {
      const dailyTotal = dailyStats[tooltipItems[0].dataIndex]
      return ` last run: ${dayjs(dailyTotal.lastCompleted).format('MM/DD/YYYY hh:mm A')}`
    },
  }

  const chartModel: TimeSeriesLineChartModel = {
    chartData: lineChart,
    chartOptions: options,
    reverseColor: true,
  }

  return (
    <Box>
      <Box minHeight={200} px={{ lg: 2 }}>
        <FadeIn>
          <ChartJsTimeSeriesLineChart data={chartModel} />
        </FadeIn>
      </Box>
    </Box>
  )
}

export default JobPerformanceLineChart

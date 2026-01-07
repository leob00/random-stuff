import { Box, useMediaQuery, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlueTransparent, CasinoOrangeTransparent, DarkGreen, DarkModeRed, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { JoBLog, Job } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import { max, mean, orderBy, sum, take } from 'lodash'
import numeral from 'numeral'
import { min } from 'lodash'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from 'components/Organizms/stocks/charts/ChartJsTimeSeriesLineChart'

const JobPerformanceLineChart = ({ data }: { data: Job }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))
  const history = data.Chart?.RawData as JoBLog[]
  const limit = isXSmall ? 14 : 30
  let height: number | undefined = undefined
  if (isXSmall) {
    height = 240
  }
  if (isLarge) {
    height = 100
  }
  const sorted = sortArray(history, ['DateCompleted'], ['desc'])

  let days = take(Array.from(new Set(sorted.map((m) => dayjs(m.DateCompleted).format('YYYY-MM-DD')))), limit)
  days = orderBy(days)

  const lineChart: BarChart = {
    colors: [],
    labels: [],
    numbers: [],
  }
  const records: number[] = []
  let minutesOrSeconds: 'minutes' | 'seconds' = 'minutes'
  const allMinutesAvg = mean(sorted.map((m) => m.TotalMinutes))
  if (allMinutesAvg < 1) {
    minutesOrSeconds = 'seconds'
  }
  days.forEach((day) => {
    const d = sorted.filter((m) => dayjs(m.DateCompleted).format('YYYY-MM-DD') === day)
    if (d.length > 0) {
      const avgMinutes = mean(d.map((m) => m.TotalMinutes))
      if (allMinutesAvg < 1) {
        lineChart.numbers.push(avgMinutes * 60)
      } else {
        lineChart.numbers.push(avgMinutes)
      }
      lineChart.labels.push(dayjs(day).format('MM/DD/YYYY'))
      lineChart.colors!.push(CasinoBlueTransparent)
      records.push(sum(d.map((m) => m.RecordsProcessed)))
    }
  })

  const maxVal = max(lineChart.numbers)
  if (maxVal) {
    const idx = lineChart.numbers.findIndex((m) => m === maxVal)
    if (idx > -1) {
      lineChart.colors![idx] = CasinoOrangeTransparent
    }
  }

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

    label: (tooltipItems) => {
      return ` ${dayjs(tooltipItems.label).format('dddd, MMMM D, YYYY')}`
    },
    afterLabel: (tooltipItems) => {
      if (minutesOrSeconds === 'seconds') {
        if (Number(tooltipItems.formattedValue) > 60) {
          return `${numeral(Number(tooltipItems.formattedValue) / 60).format('0.00')} minutes`
        }
      }
      return ` ${tooltipItems.formattedValue} ${minutesOrSeconds}`
    },
    beforeFooter: (tooltipItems) => {
      return ` _______________________________`
    },
    footer: (tooltipItems) => {
      return ` records processed: ${numeral(records[tooltipItems[0].dataIndex]).format('###,###')}`
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

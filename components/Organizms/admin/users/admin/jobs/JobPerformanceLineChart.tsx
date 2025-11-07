import { Box, useMediaQuery, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'
import { BarChart, getLineChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlueTransparent, CasinoOrangeTransparent, DarkGreen, DarkModeRed, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { JoBLog, Job } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import { max, mean, orderBy, sum, take } from 'lodash'
import numeral from 'numeral'
import { min } from 'lodash'

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

  const barChart: BarChart = {
    colors: [],
    labels: [],
    numbers: [],
  }
  const records: number[] = []
  let minutesOrSeconds = ' minutes'
  const allMinutesAvg = mean(sorted.map((m) => m.TotalMinutes))
  if (allMinutesAvg < 1) {
    minutesOrSeconds = ' seconds'
  }
  days.forEach((day) => {
    const d = sorted.filter((m) => dayjs(m.DateCompleted).format('YYYY-MM-DD') === day)
    if (d.length > 0) {
      const avgMinutes = mean(d.map((m) => m.TotalMinutes))
      if (allMinutesAvg < 1) {
        barChart.numbers.push(avgMinutes * 60)
      } else {
        barChart.numbers.push(avgMinutes)
      }
      barChart.labels.push(dayjs(day).format('MM/DD/YYYY'))
      barChart.colors.push(CasinoBlueTransparent)
      records.push(sum(d.map((m) => m.RecordsProcessed)))
    }
  })

  const maxVal = max(barChart.numbers)
  if (maxVal) {
    const idx = barChart.numbers.findIndex((m) => m === maxVal)
    if (idx > -1) {
      barChart.colors[idx] = CasinoOrangeTransparent
    }
  }

  var options = getLineChartOptions(
    { labels: barChart.labels, numbers: barChart.numbers },
    `Job performance in${minutesOrSeconds}`,
    minutesOrSeconds,
    theme.palette.mode,
    false,
  )
  options.plugins!.tooltip!.callbacks = {
    ...options.plugins!.tooltip?.callbacks,

    label: (tooltipItems) => {
      return ` ${dayjs(tooltipItems.label).format('dddd, MMMM D, YYYY')}`
    },
    afterLabel: (tooltipItems) => {
      return ` ${tooltipItems.formattedValue} ${minutesOrSeconds}`
    },
    beforeFooter: (tooltipItems) => {
      return ` _______________________________`
    },
    footer: (tooltipItems) => {
      return ` records processed: ${numeral(records[tooltipItems[0].dataIndex]).format('###,###')}`
    },
  }
  const minNum = min(barChart.numbers)
  const minNumIdx = barChart.numbers.findIndex((m) => m === minNum)
  const maxNum = max(barChart.numbers)
  const maxNumIdx = barChart.numbers.findIndex((m) => m === maxNum)
  const avg = mean(barChart.numbers)

  options.plugins!.annotation = {
    annotations: {
      line1: {
        type: 'point',
        xValue: minNumIdx,
        yValue: minNum,
        borderColor: DarkGreen,
        borderWidth: 3,
        backgroundColor: DarkGreen,
        pointStyle: 'circle',
      },
      line2: {
        type: 'point',
        xValue: maxNumIdx,
        yValue: maxNum,
        borderColor: DarkModeRed,
        borderWidth: 3,
        backgroundColor: DarkModeRed,
        pointStyle: 'circle',
      },
      line3: {
        type: 'line',
        yMin: avg,
        yMax: avg,
        borderColor: VeryLightBlueTransparent,
        borderDash: [barChart.colors.length - 1 * 22],
        borderWidth: 2,
      },
    },
  }

  return (
    <Box>
      <Box minHeight={200} px={{ lg: 2 }}>
        <FadeIn>
          <SimpleLineChart barChart={barChart} chartOptions={options} height={height} />
        </FadeIn>
      </Box>
    </Box>
  )
}

export default JobPerformanceLineChart

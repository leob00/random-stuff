'use client'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { BarChart, getBarChartOptions, getLineChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getPositiveNegativeColor } from '../StockListItem'
import dayjs from 'dayjs'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'
import { max } from 'lodash'
import { callback } from 'chart.js/dist/helpers/helpers.core'
import numeral from 'numeral'
import { CasinoGrayTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import StockMarketStatsChart from './StockMarketStatsChart'

const DailySentimentBarChart = ({ data }: { data: StockStats[] }) => {
  const theme = useTheme()
  const colors = data.map((m) => {
    return getPositiveNegativeColor(m.TotalUpPercent >= 50 ? 1 : -1)
  })
  const bar: BarChart = {
    colors: colors,
    labels: data.map((m) => dayjs(m.MarketDate).format('MM/DD/YYYY')),
    numbers: data.map((m) => m.TotalUpPercent),
  }
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))

  let height: number | undefined = undefined
  if (isXSmall) {
    height = 240
  }
  if (isLarge) {
    height = 90
  }
  const barchartOptions = getBarChartOptions('', '%', theme.palette.mode)
  //barchartOptions.scales!.y!.max = 100
  barchartOptions.plugins!.tooltip! = {
    ...barchartOptions.plugins?.tooltip,
    callbacks: {
      title: (tooltipItems) => {
        return ''
      },
      label: (tooltipItems) => {
        return ` ${tooltipItems.label}`
      },
      beforeBody: () => {
        return ''
      },
      afterLabel: (tooltipItems) => {
        return ' '
      },
      beforeFooter: (tooltipItems) => {
        return ` up: ${numeral(data[tooltipItems[0].dataIndex].TotalUpPercent).format('0.00')}%`
      },
      footer: (tooltipItems) => {
        return ` down: ${numeral(data[tooltipItems[0].dataIndex].TotalDownPercent).format('0.00')}%`
      },
      afterFooter: (tooltipItems) => {
        return ` unchanged: ${numeral(data[tooltipItems[0].dataIndex].TotalUnchangedPercent).format('0.00')}%`
      },
    },
  }

  const lineChartOptions = getLineChartOptions({ labels: bar.labels, numbers: bar.numbers }, '', '%', theme.palette.mode, true)
  lineChartOptions.plugins!.tooltip! = {
    ...lineChartOptions.plugins?.tooltip,
    callbacks: {
      title: (tooltipItems) => {
        return ''
      },
      label: (tooltipItems) => {
        return ` ${tooltipItems.label}`
      },
      beforeBody: () => {
        return ''
      },
      afterLabel: (tooltipItems) => {
        return ' '
      },
      beforeFooter: (tooltipItems) => {
        return ` up: ${numeral(data[tooltipItems[0].dataIndex].TotalUpPercent).format('0.00')}%`
      },
      footer: (tooltipItems) => {
        return ` down: ${numeral(data[tooltipItems[0].dataIndex].TotalDownPercent).format('0.00')}%`
      },
      afterFooter: (tooltipItems) => {
        return ` unchanged: ${numeral(data[tooltipItems[0].dataIndex].TotalUnchangedPercent).format('0.00')}%`
      },
    },
  }
  const lastRecord = data[data.length - 1]

  return (
    <Box>
      <Typography textAlign={'center'}>{dayjs(lastRecord.MarketDate).format('MM/DD/YYYY')}</Typography>
      <Box mt={-4}>
        <StockMarketStatsChart data={lastRecord} />
      </Box>
      <Typography pt={4} textAlign={'center'}>{`Sentiment History`}</Typography>
      <SimpleBarChart barChart={bar} chartOptions={barchartOptions} height={height} />
      <SimpleLineChart barChart={bar} chartOptions={lineChartOptions} height={height} />
    </Box>
  )
}

export default DailySentimentBarChart

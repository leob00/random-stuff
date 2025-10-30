'use client'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { BarChart, getBarChartOptions, getLineChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getPositiveNegativeColor } from '../StockListItem'
import dayjs from 'dayjs'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'

const DailySentimentBarChart = ({ data }: { data: StockStats[] }) => {
  const theme = useTheme()
  const colors = data.map((m) => {
    return getPositiveNegativeColor(m.TotalUpPercent >= 50 ? 1 : -1)
  })
  const bar: BarChart = {
    colors: colors,
    labels: data.map((m) => dayjs(m.MarketDate).format('YYYY-MM-DD')),
    numbers: data.map((m) => m.TotalUpPercent),
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
  const options = getBarChartOptions('', '%', theme.palette.mode)
  return (
    <Box>
      <Typography></Typography>
      <SimpleBarChart barChart={bar} chartOptions={options} height={height} />
      <SimpleLineChart barChart={bar} chartOptions={getLineChartOptions({ labels: bar.labels, numbers: bar.numbers }, '', '%', theme.palette.mode, true)} />
    </Box>
  )
}

export default DailySentimentBarChart

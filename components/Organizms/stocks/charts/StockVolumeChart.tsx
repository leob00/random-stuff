'use client'
import { BarChart, LineChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from './ChartJsTimeSeriesLineChart'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { useMemo } from 'react'
import numeral from 'numeral'
import dayjs from 'dayjs'
import { CasinoBlue } from 'components/themes/mainTheme'

const StockVolumeChart = ({ data }: { data: StockHistoryItem[] }) => {
  const theme = useTheme()
  const { viewPortSize } = useViewPortSize()

  const isXSmallDevice = viewPortSize === 'xs'
  let height = 200
  switch (viewPortSize) {
    case 'sm':
      height = 300
      break
    case 'md':
      height = 300
      break
    case 'lg':
      height = 300
      break
    case 'xl':
      height = 300
      break
  }
  const chart: BarChart = {
    labels: data.map((m) => m.TradeDate),
    numbers: data.map((m) => m.Volume ?? 0),
    colors: [CasinoBlue],
  }
  const options = getLineChartOptions(chart, 'volume', '', theme.palette.mode, true, false, isXSmallDevice)
  options.scales!.y!.ticks = {
    ...options.scales!.y!.ticks!,
    callback: (value) => {
      return `${numeral(value).format('0.00a')}`
    },
  }
  options.plugins!.tooltip!.callbacks = {
    ...options.plugins!.tooltip!.callbacks,
    title: (tooltipItems) => {
      return ` ${dayjs(tooltipItems[0].label).format('MM/DD/YYYY hh:mm a')}`
    },
    label: (tooltipItem) => {
      return ` ${numeral(data[tooltipItem.dataIndex].Volume).format('###,###')}`
    },
  }

  const chartModel: TimeSeriesLineChartModel = {
    chartData: chart,
    chartOptions: options,
    isXSmallDevice: isXSmallDevice,
    height,
  }

  return (
    <Box>
      <ChartJsTimeSeriesLineChart data={chartModel} />
    </Box>
  )
}

export default StockVolumeChart

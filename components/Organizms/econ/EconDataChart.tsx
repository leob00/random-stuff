import dynamic from 'next/dynamic'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { QlnLineChart } from 'lib/backend/api/qln/qlnModels'
import { getOptions } from '../stocks/lineChartOptions'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { BarChart, getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
import { max, mean, min } from 'lodash'
import { useChatbotColors } from 'components/ai/aihelper'
import { useMarketColors } from 'components/themes/marketColors'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from '../stocks/charts/ChartJsTimeSeriesLineChart'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconDataChart = ({ chart }: { chart: QlnLineChart }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const xyValues: XyValues = {
    x: chart.XValues,
    y: chart.YValues.map((m) => Number(m)),
  }

  const { chart: chartColors } = useMarketColors()

  const options = getOptions(xyValues, [], false, theme.palette.mode, false)
  const bar: BarChart = {
    labels: xyValues.x,
    numbers: xyValues.y,
    colors: [],
  }

  const lineChartOptions = getLineChartOptions({ labels: bar.labels, numbers: bar.numbers }, '', '%', theme.palette.mode, true)
  lineChartOptions.plugins!.tooltip! = {
    ...lineChartOptions.plugins?.tooltip,
    callbacks: {
      title: (tooltipItems) => {
        return ''
      },
      label: (tooltipItems) => {
        return ` ${dayjs(tooltipItems.label).format('dddd')}, ${tooltipItems.label}`
      },
      beforeBody: () => {
        return ''
      },
      afterLabel: (tooltipItems) => {
        return ' '
      },
      // beforeFooter: (tooltipItems) => {
      //   return ` up: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUpPercent).format('0.000')}%`
      // },
      // footer: (tooltipItems) => {
      //   return ` down: ${numeral(model.results[tooltipItems[0].dataIndex].TotalDownPercent).format('0.000')}%`
      // },
      // afterFooter: (tooltipItems) => {
      //   return ` unchanged: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUnchangedPercent).format('0.000')}%`
      // },
    },
  }
  const minNum = min(bar.numbers)
  const minNumIdx = bar.numbers.findIndex((m) => m === minNum)
  const maxNum = max(bar.numbers)
  const maxNumIdx = bar.numbers.findIndex((m) => m === maxNum)
  const avg = mean(bar.numbers)

  lineChartOptions.plugins!.annotation = {
    annotations: {
      line1: {
        type: 'point',
        xValue: minNumIdx,
        yValue: minNum,
        borderColor: chartColors.negativeColor,
        borderWidth: 1,
        backgroundColor: chartColors.negativeColor,
        pointStyle: 'circle',
      },
      line2: {
        type: 'point',
        xValue: maxNumIdx,
        yValue: maxNum,
        borderColor: chartColors.positiveColor,
        borderWidth: 1,
        backgroundColor: chartColors.positiveColor,
        pointStyle: 'circle',
      },
      line3: {
        type: 'line',
        yMin: avg,
        yMax: avg,
        borderColor: CasinoBlueTransparent,
        borderDash: [bar.labels.length / 2],
        borderWidth: 1,
      },
    },
  }

  const tsModel: TimeSeriesLineChartModel = {
    chartData: bar,
    chartOptions: lineChartOptions,
  }

  return (
    <Box>
      <Box borderRadius={3} p={1}>
        <ReactApexChart series={options.series} options={options} type='area' height={chartHeight} />
      </Box>
      <ChartJsTimeSeriesLineChart data={tsModel} />
    </Box>
  )
}

export default EconDataChart

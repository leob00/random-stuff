'use client'
import { BarChart, getLineChartData } from 'components/Atoms/Charts/chartJs/barChartOptions'
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
  TimeScale,
  TimeSeriesScale,
  ScriptableContext,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'
import {
  CasinoBlueTransparent,
  CasinoLimeTransparent,
  CasinoRedTransparent,
  CasinoRedTransparentChartLight,
  DarkModeRed,
  VeryLightBlueOpaque,
} from 'components/themes/mainTheme'
import { shrinkList } from '../lineChartOptions'
import { useMarketColors } from 'components/themes/marketColors'
import { max, mean, min } from 'lodash'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { getPositiveNegativeColor } from '../StockListItem'
import { calculatePercent } from 'lib/util/numberUtil'
import { Box, Stack, useTheme } from '@mui/material'

ChartJS.register(
  annotationPlugin,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale,
)
export type TimeSeriesLineChartModel = {
  height?: number
  chartData: BarChart
  chartOptions: ChartOptions<'line'>
  reverseColor?: boolean
}

const ChartJsTimeSeriesLineChart = ({ data }: { data: TimeSeriesLineChartModel }) => {
  const { chart: chartColors, getPositiveNegativeChartColor } = useMarketColors()
  const ds = getLineChartData(data.chartData.labels, data.chartData.numbers, data.chartData.colors)
  const theme = useTheme()

  ds.datasets[0].backgroundColor = (context: ScriptableContext<'line'>) => {
    const ctx = context.chart.ctx
    const gradient = ctx.createLinearGradient(10, 10, 10, 500)
    gradient.addColorStop(0, data.chartData.colors[0])
    gradient.addColorStop(1, VeryLightBlueOpaque)
    return gradient
  }
  const lineChartOptions = { ...data.chartOptions }
  const minNum = min(data.chartData.numbers)
  const minNumIdx = data.chartData.numbers.findIndex((m) => m === minNum)
  const maxNum = max(data.chartData.numbers)
  const maxNumIdx = data.chartData.numbers.findIndex((m) => m === maxNum)
  const avg = mean(data.chartData.numbers)

  lineChartOptions.plugins!.annotation = {
    annotations: {
      line1: {
        type: 'point',
        xValue: minNumIdx,
        yValue: minNum,
        borderColor: !data.reverseColor ? chartColors.negativeColor : chartColors.positiveColor,
        borderWidth: 1,
        backgroundColor: !data.reverseColor ? chartColors.negativeColor : chartColors.positiveColor,
        pointStyle: 'circle',
      },
      line2: {
        type: 'point',
        xValue: maxNumIdx,
        yValue: maxNum,
        borderColor: !data.reverseColor ? chartColors.positiveColor : chartColors.negativeColor,
        borderWidth: 1,
        backgroundColor: !data.reverseColor ? chartColors.positiveColor : chartColors.negativeColor,
        pointStyle: 'circle',
      },
      line3: {
        type: 'line',
        yMin: avg,
        yMax: avg,
        borderColor: CasinoBlueTransparent,
        borderDash: [data.chartData.labels.length / 10],
        borderWidth: 1,
      },
    },
  }

  return (
    <Box height={data.height ? data.height : { xs: 300, sm: 500, md: 550 }} width={'100%'}>
      <Line data={ds} options={lineChartOptions} />
    </Box>
  )
}

export default ChartJsTimeSeriesLineChart

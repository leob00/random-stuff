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
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { BarChart, LineChart } from './barChartOptions'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import annotationPlugin from 'chartjs-plugin-annotation'
import { getLineChartData, getLineChartOptions } from './lineChartOptions'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { CasinoBlue } from 'components/themes/mainTheme'

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

const SimpleLineChart = ({
  title,
  barChart,
  yAxisDecorator = '',
  height,
  chartOptions,
}: {
  title?: string
  barChart: BarChart
  yAxisDecorator?: string
  height?: number
  chartOptions?: ChartOptions<'line'>
}) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))
  let hgt = height
  if (!hgt) {
    if (isXSmall) {
      hgt = 240
    }
    if (isLarge) {
      hgt = 90
    }
  }
  const lineChart: LineChart = {
    labels: barChart.labels,
    numbers: barChart.numbers,
  }
  const options = chartOptions ?? getLineChartOptions(lineChart, title ?? '', yAxisDecorator, theme.palette.mode)
  const data = getLineChartData(barChart.labels, barChart.numbers, barChart.colors ?? [CasinoBlue])

  return (
    <Box>
      <FadeIn>
        <Line data={data} options={options} height={hgt} />
      </FadeIn>
    </Box>
  )
}

export default SimpleLineChart

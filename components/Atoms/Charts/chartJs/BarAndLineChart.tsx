import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  ChartOptions,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions, getBarLineChartConfig } from './barChartOptions'
import { Box, useTheme } from '@mui/material'

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController)

const BarAndLineChart = ({
  title,
  barChart,
  yAxisDecorator = '',
  isHorizontal,
  height,
  chartOptions,
}: {
  title?: string
  barChart: BarChart
  yAxisDecorator?: string
  isHorizontal?: boolean
  height?: number
  chartOptions?: ChartOptions<'bar'>
}) => {
  const theme = useTheme()
  const options = chartOptions ?? getBarChartOptions(title ?? '', yAxisDecorator, theme.palette.mode, isHorizontal)
  const data = {
    labels: barChart.labels,
    datasets: [
      {
        type: 'line',
        label: 'Dataset 1',
        borderColor: barChart.colors,
        borderWidth: 2,
        fill: false,
        data: barChart.numbers,
        backgroundColor: barChart.colors,
      },
      {
        type: 'bar' as const,
        label: 'Dataset 2',
        backgroundColor: barChart.colors,
        data: barChart.numbers,
        borderWidth: 0,
      },
    ],
  }

  return (
    <Box>
      {/* @ts-ignore */}
      <Chart type='bar' data={data} options={options} height={height} />
    </Box>
  )
}

export default BarAndLineChart

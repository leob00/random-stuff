import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions, getLineChartData, getLineChartOptions } from './barChartOptions'
import { Box, useTheme } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SimpleLineChart = ({
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
  chartOptions?: ChartOptions<'line'>
}) => {
  const theme = useTheme()
  const options = chartOptions ?? getLineChartOptions(title ?? '', yAxisDecorator, theme.palette.mode, isHorizontal)
  const data = getLineChartData(barChart.labels, barChart.numbers, barChart.colors)

  return (
    <Box>
      <Line data={data} options={options} height={height} />
    </Box>
  )
}

export default SimpleLineChart

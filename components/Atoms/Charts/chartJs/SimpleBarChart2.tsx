import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from './barChartOptions'
import { Box, useTheme } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SimpleBarChart2 = ({
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
  const options = chartOptions ?? getBarChartOptions(title ?? '', barChart, yAxisDecorator, barChart.colors, theme.palette.mode, isHorizontal)

  const data = getBarChartData(barChart.labels, barChart.numbers, barChart.colors)
  return (
    <Box>
      <Bar data={data} options={options} height={height} />
    </Box>
  )
}

export default SimpleBarChart2

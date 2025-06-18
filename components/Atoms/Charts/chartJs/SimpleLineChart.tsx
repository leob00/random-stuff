import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { BarChart, getLineChartData, getLineChartOptions } from './barChartOptions'
import { Box, useTheme } from '@mui/material'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(annotationPlugin, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend)

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
  const options = chartOptions ?? getLineChartOptions(title ?? '', yAxisDecorator, theme.palette.mode)
  const data = getLineChartData(barChart.labels, barChart.numbers, barChart.colors)

  return (
    <Box>
      <Line data={data} options={options} height={height} />
    </Box>
  )
}

export default SimpleLineChart

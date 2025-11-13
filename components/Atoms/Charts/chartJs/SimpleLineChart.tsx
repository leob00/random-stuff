import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, ChartOptions, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { BarChart, getLineChartData, LineChart } from './barChartOptions'
import { Box, useTheme } from '@mui/material'
import annotationPlugin from 'chartjs-plugin-annotation'
import { getLineChartOptions } from './lineChartOptions'

ChartJS.register(annotationPlugin, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend, Filler)

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
  const lineChart: LineChart = {
    labels: barChart.labels,
    numbers: barChart.numbers,
  }
  const options = chartOptions ?? getLineChartOptions(lineChart, title ?? '', yAxisDecorator, theme.palette.mode)
  const data = getLineChartData(barChart.labels, barChart.numbers, barChart.colors)

  return (
    <Box>
      <Line data={data} options={options} height={height} />
    </Box>
  )
}

export default SimpleLineChart

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from './barChartOptions'
import { Box, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { CasinoBlue } from 'components/themes/mainTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SimpleBarChart = ({
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
  const data = getBarChartData(barChart.labels, barChart.numbers, barChart.colors ?? [CasinoBlue])

  return (
    <Box>
      <FadeIn>
        <Box height={{ xs: 300, sm: 500, md: 550 }} width={'100%'}>
          <Bar data={data} options={options} />
        </Box>
      </FadeIn>
    </Box>
  )
}

export default SimpleBarChart

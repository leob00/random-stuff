import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMediaQuery, useTheme } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChartStacked = ({ data, options }: { data: ChartData<'bar', number[], unknown>; options: ChartOptions<'bar'> }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <Bar data={data} options={options} height={isXSmall ? 240 : 100} />
    </>
  )
}

export default BarChartStacked

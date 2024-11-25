'use client'
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { getPieChartData, getPieChartOptions } from 'components/Atoms/Charts/chartJs/pieChartOptions'
import { Box, useMediaQuery, useTheme } from '@mui/material'

ChartJS.register(ArcElement, Tooltip, Legend)

const BasicPieChart = ({ title, barChart }: { title: string; barChart: BarChart }) => {
  const theme = useTheme()
  const options = getPieChartOptions(title, theme.palette.mode)

  const data = getPieChartData(barChart.labels, barChart.numbers, barChart.colors, barChart.borderColors)
  return (
    <Box>
      <Doughnut data={data} options={options} width={350} />
    </Box>
  )
}

export default BasicPieChart

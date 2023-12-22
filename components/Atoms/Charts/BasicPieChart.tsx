import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut, Pie } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from 'components/Molecules/Charts/barChartOptions'
import { getPieChartData, getPieChartOptions } from 'components/Molecules/Charts/pieChartOptions'
import { Box, useTheme } from '@mui/material'

ChartJS.register(ArcElement, Tooltip, Legend)

const BasicPieChart = ({ title, barChart }: { title: string; barChart: BarChart }) => {
  const theme = useTheme()
  const options = getPieChartOptions(title, theme.palette.mode)

  const data = getPieChartData(barChart.labels, barChart.numbers, barChart.colors, barChart.borderColors)
  return (
    <Box>
      <Doughnut data={data} options={options} />
    </Box>
  )
}

export default BasicPieChart

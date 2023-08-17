import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from './barChartOptions'
import { useTheme } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SimpleBarChart2 = ({ title, barChart }: { title: string; barChart: BarChart }) => {
  const theme = useTheme()
  const options = getBarChartOptions(title, barChart, '', barChart.colors, theme.palette.mode)

  const data = getBarChartData(barChart.labels, barChart.numbers, barChart.colors)
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default SimpleBarChart2

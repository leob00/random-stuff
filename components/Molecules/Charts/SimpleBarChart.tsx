import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getBarChartData, getBarChartOptions } from './barChartOptions'
import { Blue800, BrightGreen, DarkBlue, DarkGreen, LightBlue } from 'components/themes/mainTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SimpleBarChart = ({ labels, numbers, colors }: { labels: string[]; numbers: number[]; colors: string[] }) => {
  const options = getBarChartOptions('Flip Stats')

  const data = getBarChartData(labels, numbers, colors)
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default SimpleBarChart

import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from 'components/Molecules/Charts/barChartOptions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BasicBarChart = ({ title, barChart }: { title: string; barChart: BarChart }) => {
  const options = getBarChartOptions(title, barChart)

  const data = getBarChartData(barChart.labels, barChart.numbers, barChart.colors)
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default BasicBarChart

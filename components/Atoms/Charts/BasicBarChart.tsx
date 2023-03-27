import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { BarChart, getBarChartData, getBarChartOptions } from 'components/Molecules/Charts/barChartOptions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BasicBarChart = ({ title, barChart, yAxisDecorator = '' }: { title: string; barChart: BarChart; yAxisDecorator?: string }) => {
  const options = getBarChartOptions(title, barChart, yAxisDecorator, barChart.colors)

  const data = getBarChartData(barChart.labels, barChart.numbers, barChart.colors, yAxisDecorator)
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default BasicBarChart

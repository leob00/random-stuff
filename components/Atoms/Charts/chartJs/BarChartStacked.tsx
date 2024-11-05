import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getRandomInteger } from 'lib/util/numberUtil'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChartStacked = ({ data, options }: { data: ChartData<'bar', number[], unknown>; options: ChartOptions<'bar'> }) => {
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default BarChartStacked

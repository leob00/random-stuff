import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getRandomInteger } from 'lib/util/numberUtil'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options: ChartOptions<'bar'> = {
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Roulette Chart',
    },
  },
}

const labels = ['red / black', 'zero / double 0']

const data: ChartData<'bar', number[], unknown> = {
  labels,
  datasets: [
    {
      label: 'red / black',
      data: labels.map(() => getRandomInteger(0, 1000)),
      backgroundColor: CasinoRedTransparent,
    },
    {
      label: 'zero / double zero',
      data: labels.map(() => getRandomInteger(0, 1000)),
      backgroundColor: CasinoGreenTransparent,
    },
  ],
}

const MultiDatasetBarchartExample = () => {
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default MultiDatasetBarchartExample

import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getRandomInteger } from 'lib/util/numberUtil'
import { CasinoBlackTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
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

export const data = {
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
      backgroundColor: CasinoBlackTransparent,
    },
  ],
}

const MultiDatasetBarchart = () => {
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default MultiDatasetBarchart

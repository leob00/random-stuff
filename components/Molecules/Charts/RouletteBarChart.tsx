import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { CasinoBlack, CasinoBlackTransparent, CasinoBlue, CasinoBlueTransparent, CasinoGreen, CasinoGreenTransparent, CasinoOrange, CasinoOrangeTransparent, CasinoRed, CasinoRedTransparent } from 'components/themes/mainTheme'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'
import { WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { calculatePercent } from 'lib/util/numberUtil'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RouletteBarChart = ({ data, title = 'Roulette Chart' }: { data: WheelSpinStats; title?: string }) => {
  const chartData: ChartData<'bar', number[], string> = {
    labels: [''],
    datasets: [
      {
        label: 'red%',
        data: [calculatePercent(data.red, data.total)],
        backgroundColor: CasinoRed,
        stack: 'Stack 1',
      },
      {
        label: 'red',
        data: [data.red],
        backgroundColor: CasinoRedTransparent,
        stack: 'Stack 1',
      },
      {
        label: 'black%',
        data: [calculatePercent(data.black, data.total)],
        backgroundColor: CasinoBlack,
        stack: 'Stack 2',
      },
      {
        label: 'black',
        data: [data.black],
        backgroundColor: CasinoBlackTransparent,
        stack: 'Stack 2',
      },
      //odd even
      {
        label: 'odd%',
        data: [calculatePercent(data.odd, data.total)],
        backgroundColor: CasinoOrange,
        stack: 'Stack 3',
      },
      {
        label: 'odd',
        data: [data.odd],
        backgroundColor: CasinoOrangeTransparent,
        stack: 'Stack 3',
      },
      {
        label: 'even%',
        data: [calculatePercent(data.even, data.total)],
        backgroundColor: CasinoBlue,
        stack: 'Stack 4',
      },
      {
        label: 'even',
        data: [data.even],
        backgroundColor: CasinoBlueTransparent,
        stack: 'Stack 4',
      },
      // new
      {
        label: 'zero%',
        data: [calculatePercent(data.zero, data.total)],
        backgroundColor: CasinoGreen,
        stack: 'Stack 5',
      },
      {
        label: 'zero',
        data: [data.zero],
        backgroundColor: CasinoGreenTransparent,
        stack: 'Stack 5',
      },
      {
        label: 'doublezero%',
        data: [calculatePercent(data.doubleZero, data.total)],
        backgroundColor: CasinoGreen,
        stack: 'Stack 6',
      },
      {
        label: 'double zero',
        data: [data.doubleZero],
        backgroundColor: CasinoGreenTransparent,
        stack: 'Stack 6',
      },
    ],
  }
  const options: ChartOptions<'bar'> = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        padding: 16,
        footerSpacing: 2,
        footerMarginTop: 10,
        footerFont: {
          weight: '',
          size: 15,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            if (tooltipItems.dataset.label && tooltipItems.dataset.label.includes('%')) {
              return ` ${tooltipItems.dataset.label.replaceAll('%', '')}: ${tooltipItems.formattedValue}%`
            }
            return ` ${tooltipItems.dataset.label}: ${tooltipItems.formattedValue}`
            // return ` ${tooltipItems.formattedValue}`
          },
        },
      },
    },
  }

  return (
    <>
      <Bar data={chartData} options={options} />
    </>
  )
}

export default RouletteBarChart

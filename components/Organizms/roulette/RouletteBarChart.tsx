import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { CasinoBlack, CasinoBlackTransparent, CasinoBlue, CasinoGreen, CasinoOrange, CasinoRed } from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { calculatePercent } from 'lib/util/numberUtil'
import numeral from 'numeral'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RouletteBarChart = ({ data, title = 'Roulette Chart' }: { data: WheelSpinStats; title?: string }) => {
  const totals = [data.red, data.black, data.odd, data.even, data.zero, data.doubleZero]
  const totalsAsPercent = [
    calculatePercent(data.red, data.total),
    calculatePercent(data.black, data.total),
    calculatePercent(data.odd, data.total),
    calculatePercent(data.even, data.total),
    calculatePercent(data.zero, data.total),
    calculatePercent(data.doubleZero, data.total),
  ]
  const chartData: ChartData<'bar', number[], string> = {
    labels: ['red', 'black', 'odd', 'even', 'zero', 'double-zero'],
    datasets: [
      {
        label: '%',
        data: totalsAsPercent,
        backgroundColor: [CasinoRed, CasinoBlack, CasinoOrange, CasinoBlue, CasinoGreen, CasinoGreen],
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
        backgroundColor: CasinoBlack,
        padding: 16,
        footerSpacing: 2,
        //footerMarginTop: 10,
        titleSpacing: 2,
        titleMarginBottom: 8,

        titleFont: {
          size: 16,
        },
        footerFont: {
          size: 15,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${chartData.labels![tooltipItems[0].dataIndex]} total: ${numeral(totals[tooltipItems[0].dataIndex]).format('###,###')}`
          },
          label: (tooltipItems) => {
            if (tooltipItems.dataset.label && tooltipItems.dataset.label.includes('%')) {
              return ` ${Number(tooltipItems.formattedValue).toFixed(2)}%`
            }
            return ` ${tooltipItems.dataset.label}: ${tooltipItems.formattedValue}`
            // return ` ${tooltipItems.formattedValue}`
          },
          // footer: (tooltipItems) => {
          //   return `  total result: ${numeral(totals[tooltipItems[0].dataIndex]).format('###,###')}`
          // },
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

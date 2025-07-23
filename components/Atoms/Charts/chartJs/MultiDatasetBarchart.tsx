import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import {
  CasinoBlack,
  CasinoBlackTransparent,
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoOrange,
  CasinoOrangeTransparent,
  CasinoRed,
  CasinoRedTransparent,
} from 'components/themes/mainTheme'
import { getDynamoItemData } from 'lib/backend/csr/nextApiWrapper'
import { WheelSpinStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { calculatePercent } from 'lib/util/numberUtil'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const MultiDatasetBarchart = () => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    // scales: {
    //   x: {
    //     stacked: true,
    //   },
    //   y: {
    //     stacked: true,
    //   },
    // },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'Roulette Chart',
      },
      tooltip: {
        padding: 16,
        footerSpacing: 2,
        footerMarginTop: 10,
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
            return ''
          },
          label: (tooltipItems) => {
            if (tooltipItems.dataset.label && tooltipItems.dataset.label.includes('%')) {
              return ` ${tooltipItems.formattedValue}%`
            }
            return ` total: ${tooltipItems.formattedValue}`
            // return ` ${tooltipItems.formattedValue}`
          },
        },
      },
    },
  }

  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({ datasets: [] })

  const getStat = (stat: WheelSpinStats, key: keyof WheelSpinStats) => {
    return stat[key]
  }

  useEffect(() => {
    const fn = async () => {
      const result = await getDynamoItemData<WheelSpinStats>('wheelspin-community')

      const data: ChartData<'bar', number[], string> = {
        labels: [''],
        datasets: [
          {
            label: 'red/black%',
            data: [calculatePercent(result.red, result.total)],
            backgroundColor: CasinoRed,
            stack: 'Stack 1',
          },
          {
            label: 'red/black',
            data: [result.red],
            backgroundColor: CasinoRedTransparent,
            stack: 'Stack 1',
          },
          {
            label: 'red/black%',
            data: [calculatePercent(result.black, result.total)],
            backgroundColor: CasinoBlack,
            stack: 'Stack 2',
          },
          {
            label: 'red/black',
            data: [result.black],
            backgroundColor: CasinoBlackTransparent,
            stack: 'Stack 2',
          },

          {
            label: 'odd/even%',
            data: [calculatePercent(result.odd, result.total)],
            backgroundColor: CasinoOrange,
            stack: 'Stack 3',
          },
          {
            label: 'odd/even',
            data: [result.odd],
            backgroundColor: CasinoOrangeTransparent,
            stack: 'Stack 3',
          },
          {
            label: 'odd/even%',
            data: [calculatePercent(result.even, result.total)],
            backgroundColor: CasinoBlue,
            stack: 'Stack 4',
          },
          {
            label: 'odd/even',
            data: [result.even],
            backgroundColor: CasinoBlueTransparent,
            stack: 'Stack 4',
          },

          // {
          //   label: 'red',
          //   data: [result.red],
          //   backgroundColor: CasinoRed,
          // },
          // {
          //   label: 'black',
          //   data: [result.black, calculatePercent(result.black, result.total)],
          //   backgroundColor: CasinoBlackTransparent,
          //   // stack: 'Stack 1',
          // },
          // {
          //   label: 'black',
          //   data: [result.black],
          //   backgroundColor: CasinoBlack,
          //   // stack: 'Stack 1',
          // },
          // {
          //   label: 'odd',
          //   data: [result.odd, calculatePercent(result.odd, result.total)],
          //   backgroundColor: CasinoOrangeTransparent,
          //   // stack: 'Stack 2',
          // },
          // {
          //   label: 'odd',
          //   data: [result.odd],
          //   backgroundColor: CasinoOrange,
          //   // stack: 'Stack 2',
          // },
          // {
          //   label: 'even%',
          //   data: [calculatePercent(result.even, result.total)],
          //   backgroundColor: CasinoBlueTransparent,
          //   // stack: 'Stack 3',
          // },
          // {
          //   label: 'even',
          //   data: [result.even],
          //   backgroundColor: CasinoBlue,
          //   // stack: 'Stack 3',
          // },
        ],
      }
      setChartData(data)
    }
    fn()
  }, [])

  return (
    <>
      <Bar data={chartData} options={options} />
    </>
  )
}

export default MultiDatasetBarchart

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { CasinoBlack, CasinoBlackDarkMode, CasinoBlue, CasinoGreen, CasinoOrange, CasinoRed } from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { calculatePercent } from 'lib/util/numberUtil'
import numeral from 'numeral'
import { useTheme } from '@mui/material'
import { getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'

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
  const theme = useTheme()
  const black = theme.palette.mode === 'dark' ? CasinoBlackDarkMode : CasinoBlack
  const chartData: ChartData<'bar', number[], string> = {
    labels: ['red', 'black', 'odd', 'even', 'zero', 'double-zero'],
    datasets: [
      {
        label: '%',
        data: totalsAsPercent,
        backgroundColor: [CasinoRed, black, CasinoOrange, CasinoBlue, CasinoGreen, CasinoGreen],
      },
    ],
  }

  const options = getBarChartOptions(title, '', theme.palette.mode, false, true)
  options.plugins!.tooltip!.callbacks = {
    title: (tooltipItems) => {
      return `${chartData.labels![tooltipItems[0].dataIndex]} total: ${numeral(totals[tooltipItems[0].dataIndex]).format('###,###')}`
    },
    label: (tooltipItems) => {
      if (tooltipItems.dataset.label && tooltipItems.dataset.label.includes('%')) {
        return ` ${Number(tooltipItems.formattedValue).toFixed(2)}%`
      }
      return ` ${tooltipItems.dataset.label}: ${tooltipItems.formattedValue}`
    },
  }

  return (
    <>
      <Bar data={chartData} options={options} />
    </>
  )
}

export default RouletteBarChart

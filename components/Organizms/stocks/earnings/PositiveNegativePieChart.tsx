import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { calculatePercent } from 'lib/util/numberUtil'

const PositiveNegativePieChart = ({ reported }: { reported: StockEarning[] }) => {
  const up = reported.filter((m) => m.ActualEarnings! > 0)
  const down = reported.filter((m) => m.ActualEarnings! < 0)

  const pieChart: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent],
    labels: ['positive', 'negative'],
    borderColors: [CasinoGreenTransparent, CasinoRedTransparent],
    numbers: [calculatePercent(up.length, reported.length), calculatePercent(down.length, reported.length)],
  }
  return <BasicPieChart barChart={pieChart} title='Earnings: positive / negative totals' />
}

export default PositiveNegativePieChart

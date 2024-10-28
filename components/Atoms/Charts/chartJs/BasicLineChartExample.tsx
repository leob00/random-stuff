import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement, ScriptableContext, Filler } from 'chart.js'
import { getRandomInteger } from 'lib/util/numberUtil'
import {
  CasinoBlueTransparent,
  CasinoDarkRedTransparent,
  CasinoGrayTransparent,
  CasinoGreen,
  CasinoLightGrayTransparent,
  CasinoLimeTransparent,
  CasinoOrange,
  CasinoRed,
  CasinoRedTransparent,
  DarkBlueTransparent,
  DarkModeBlue,
  DarkModeBlueTransparent,
  RedDarkMode,
} from 'components/themes/mainTheme'
import { Line } from 'react-chartjs-2'
import { getLineChartOptions } from './lineChartOptions'
import { LineChart } from './barChartOptions'
import { useTheme } from '@mui/material'
import { range } from 'lodash'
import dayjs from 'dayjs'

//Chart.register(PointElement)

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement, Filler)

const BasicLineChartExample = () => {
  const theme = useTheme()
  const generatedLabels: string[] = []
  const r = range(0, 100)

  r.forEach((val, index) => {
    generatedLabels.push(dayjs().add(index, 'days').format())
  })

  const values: LineChart = {
    labels: [],
    numbers: [],
  }
  const y = generatedLabels.map(() => getRandomInteger(30, 92))
  const data = {
    labels: generatedLabels,
    datasets: [
      {
        label: 'Dataset 1',
        data: y,
        borderColor: RedDarkMode,
        borderWidth: 1,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(10, 10, 10, 500)
          gradient.addColorStop(0, RedDarkMode)
          gradient.addColorStop(1, DarkModeBlue)
          return gradient
        },
        fill: true,
      },
    ],
  }

  const opts = getLineChartOptions('Title Example', values, undefined, theme.palette.mode)
  return (
    <>
      <Line data={data} options={opts} />
    </>
  )
}

export default BasicLineChartExample

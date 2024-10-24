import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js'
import { getRandomInteger } from 'lib/util/numberUtil'
import { CasinoGreen, CasinoLimeTransparent, CasinoOrange } from 'components/themes/mainTheme'
import { Line } from 'react-chartjs-2'
import { getLineChartOptions } from './lineChartOptions'
import { LineChart } from './barChartOptions'
import { useTheme } from '@mui/material'
import { range } from 'lodash'
import dayjs from 'dayjs'

//Chart.register(PointElement)

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement)

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
        bborderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color
        fill: true, // Enable fill
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

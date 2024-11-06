import { Box, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { StockEarningAggregate } from 'lib/backend/api/qln/qlnApi'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { BarChart, getStackedBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { ChartData } from 'chart.js'
import { calculatePercent } from 'lib/util/numberUtil'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import numeral from 'numeral'
import { sum } from 'lodash'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'

const QuarterlyEarningsReport = ({ data }: { data: StockEarningAggregate[] }) => {
  const theme = useTheme()

  const labels = data.map((m) => {
    return `${m.Year} - Q${m.Quarter}`
  })

  const chartOptions = getStackedBarChartOptions(theme.palette.mode)
  chartOptions.plugins!.tooltip!.callbacks = {
    title: (tooltipItems) => {
      return ''
    },
    label: (tooltipItems) => {
      return ` ${[tooltipItems.label]}`
    },
    afterLabel: (tooltipItems) => {
      let result = `${tooltipItems.dataset.label}: `
      if (tooltipItems.datasetIndex === 0) {
        return `${result}${numeral(data[tooltipItems.dataIndex].PositiveCount).format('###,###')} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
      }
      return `${result}${numeral(data[tooltipItems.dataIndex].NegativeCount).format('###,###')} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
    },
  }

  const chartDataset: ChartData<'bar', number[], unknown> = {
    labels: labels,
    datasets: [
      {
        label: 'positive',
        data: data.map((item) => {
          return calculatePercent(item.PositiveCount, item.RecordCount)
        }),
        backgroundColor: CasinoGreenTransparent,
      },
      {
        label: 'negative',
        data: data.map((item) => {
          return calculatePercent(item.NegativeCount, item.RecordCount)
        }),
        backgroundColor: CasinoRedTransparent,
      },
    ],
  }

  const up = sum(data.map((m) => m.PositiveCount))
  const down = sum(data.map((m) => m.NegativeCount))
  const total = sum(data.map((m) => m.RecordCount))

  const pieChart: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent],
    labels: ['positive', 'negative'],
    borderColors: [CasinoGreenTransparent, CasinoRedTransparent],
    numbers: [calculatePercent(up, total), calculatePercent(down, total)],
  }

  return (
    <>
      <Box py={2}>
        <FadeIn>
          <BarChartStacked data={chartDataset} options={chartOptions} />
        </FadeIn>
      </Box>
      <Box py={2} display={'flex'} justifyContent={'center'}>
        <FadeIn>
          <BasicPieChart barChart={pieChart} title='Earnings: positive / negative totals' />
        </FadeIn>
      </Box>
    </>
  )
}

export default QuarterlyEarningsReport

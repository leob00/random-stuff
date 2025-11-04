import { Box, useTheme } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { StockEarningsGroup } from './StockEarningsDisplay'
import { sum } from 'lodash'
import { sortArray } from 'lib/util/collections'
import { getMultiDatasetBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { ChartData } from 'chart.js'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import { CasinoBlueTransparent, CasinoOrangeTransparent } from 'components/themes/mainTheme'
import numeral from 'numeral'

type Model = {
  actual: number
  estimated: number
  recordCount: number
}

const StockEarningsByYearBarChart = ({ data }: { data: StockEarning[] }) => {
  const theme = useTheme()
  const yearsGroup: StockEarningsGroup[] = []
  const allYears = Array.from(new Set(data.map((m) => m.Year!)))
  allYears.forEach((year) => {
    yearsGroup.push({
      key: year,
      items: data.filter((m) => m.Year === year),
    })
  })
  const sortedYears = sortArray(yearsGroup, ['key'], ['asc'])

  const chartData: Model[] = []
  sortedYears.forEach((year) => {
    const act = year.items.map((m) => m.ActualEarnings)
    const est = year.items.map((m) => m.EstimatedEarnings)
    chartData.push({
      actual: sum(act),
      estimated: sum(est),
      recordCount: year.items.length,
    })
  })
  const actuals = chartData.map((m) => m.actual)
  const estimated = chartData.map((m) => m.estimated)

  const labels = sortedYears.map((m) => m.key)

  const chartOptions = { ...getMultiDatasetBarChartOptions({ palette: theme.palette.mode, showLegend: true }) }
  chartOptions.plugins!.tooltip!.callbacks = {
    title: (tooltipItems) => {
      return ''
    },
    label: (tooltipItems) => {
      return ` ${[tooltipItems.label]}`
    },
    afterLabel: (tooltipItems) => {
      let result = `${tooltipItems.dataset.label}: `
      return `${result}$${numeral(tooltipItems.formattedValue).format('###,###,0.00')}`
    },
    beforeFooter: (tooltipItems) => {
      return `___________________________`
    },
    footer: (tooltipItems) => {
      return ` total records: ${numeral(chartData[tooltipItems[0].dataIndex].recordCount).format('###,###')}`
    },
  }

  chartOptions.scales!.y!.ticks!.callback = (tickValue, index, ticks) => {
    return `$${numeral(tickValue).format('0.00')}`
  }

  const chartDataset: ChartData<'bar', number[], unknown> = {
    labels: labels,
    datasets: [
      {
        label: 'estimated',
        data: estimated,
        backgroundColor: CasinoOrangeTransparent,
      },
      {
        label: 'actual',
        data: actuals,
        backgroundColor: CasinoBlueTransparent,
      },
    ],
  }
  return (
    <Box py={2}>
      <Box>
        <FadeIn>
          <BarChartStacked data={chartDataset} options={chartOptions} />
        </FadeIn>
      </Box>
    </Box>
  )
}

export default StockEarningsByYearBarChart

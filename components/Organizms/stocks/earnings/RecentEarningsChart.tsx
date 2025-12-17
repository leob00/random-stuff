import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import { ChartData } from 'chart.js'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import { BarChart, getMultiDatasetBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { calculatePercent } from 'lib/util/numberUtil'
import numeral from 'numeral'

const RecentEarningsChart = ({ reported }: { reported: StockEarning[] }) => {
  const days = new Set(reported.map((m) => m.ReportDate))
  const theme = useTheme()

  const chartData: BarChart[] = [
    {
      colors: [CasinoGreenTransparent],
      labels: [],
      numbers: [],
      rawData: [],
    },
    {
      colors: [CasinoRedTransparent],
      labels: [],
      numbers: [],
      rawData: [],
    },
  ]

  const daysArray = Array.from(days)

  daysArray.forEach((day) => {
    const dayData = reported.filter((m) => m.ReportDate === day)!
    const up = dayData.filter((m) => m.ActualEarnings! > 0)
    const down = dayData.filter((m) => m.ActualEarnings! < 0)
    chartData[0].labels.push(dayjs(day).format('MM/DD/YYYY'))
    chartData[0].numbers.push(calculatePercent(up.length, dayData.length))
    chartData[0].rawData!.push({ ...dayData })
    chartData[1].labels.push(dayjs(day).format('MM/DD/YYYY'))
    chartData[1].numbers.push(calculatePercent(down.length, dayData.length))
    chartData[1].rawData!.push({ ...dayData })
  })
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
      if (tooltipItems.datasetIndex === 0) {
        return `${result}${reported.filter((m) => dayjs(m.ReportDate).format('MM/DD/YYYY') === tooltipItems.label && m.ActualEarnings! > 0).length} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
      }
      return `${result}${reported.filter((m) => dayjs(m.ReportDate).format('MM/DD/YYYY') === tooltipItems.label && m.ActualEarnings! < 0).length} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
    },
    beforeFooter: (tooltipItems) => {
      return `___________________________`
    },
    footer: (tooltipItems) => {
      return ` total records: ${numeral(reported.filter((m) => dayjs(m.ReportDate).format('MM/DD/YYYY') === tooltipItems[0].label).length).format('###,###')}`
    },
  }

  const chartDataset: ChartData<'bar', number[], unknown> = {
    labels: daysArray.map((m) => dayjs(m).format('MM/DD/YYYY')),
    datasets: [
      {
        label: 'positive',
        data: daysArray.map((day) => {
          const dayData = reported.filter((m) => m.ReportDate === day)!
          const up = dayData.filter((m) => m.ActualEarnings! > 0)
          return calculatePercent(up.length, dayData.length)
        }),
        backgroundColor: CasinoGreenTransparent,
      },
      {
        label: 'negative',
        data: daysArray.map((day) => {
          const dayData = reported.filter((m) => m.ReportDate === day)!
          const down = dayData.filter((m) => m.ActualEarnings! < 0)
          return calculatePercent(down.length, dayData.length)
        }),
        backgroundColor: CasinoRedTransparent,
      },
    ],
  }
  return (
    <>
      <Box py={2}>
        <BarChartStacked data={chartDataset} options={chartOptions} />
      </Box>
      <Box py={2}>
        <CenterStack>
          <ReadOnlyField
            label='date range'
            val={`${reported.length > 0 ? `${dayjs(reported[0].ReportDate!).format('MM/DD/YYYY')} - ${dayjs(reported[reported.length - 1].ReportDate!).format('MM/DD/YYYY')}` : 'N/A'}`}
          />
        </CenterStack>
      </Box>
    </>
  )
}

export default RecentEarningsChart

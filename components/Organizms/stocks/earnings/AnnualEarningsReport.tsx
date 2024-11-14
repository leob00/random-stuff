import { Box, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { StockEarningAggregate } from 'lib/backend/api/qln/qlnApi'
import { CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { BarChart, getMultiDatasetBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { ChartData } from 'chart.js'
import { calculatePercent } from 'lib/util/numberUtil'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import numeral from 'numeral'
import { sum } from 'lodash'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { getDateRangeForQuarter } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterOfYear)

type Model = {
  positive: number
  negative: number
  recordCount: number
}

const AnnualEarningsReport = ({ apiData, mutateKey }: { apiData: StockEarningAggregate[]; mutateKey: string }) => {
  const theme = useTheme()

  const startDate = apiData.length > 0 ? getDateRangeForQuarter(apiData[0].Year, apiData[0].Quarter).startDate : null
  const endDate = apiData.length > 0 ? getDateRangeForQuarter(apiData[apiData.length - 1].Year, apiData[apiData.length - 1].Quarter).endDate : null

  const yearsSet = new Set(apiData.map((m) => m.Year))
  const years = Array.from(yearsSet.values())
  const labels = years.map((m) => {
    return `${m}`
  })
  const yearMap = new Map<number, Model>()
  years.forEach((year) => {
    const d = apiData.filter((m) => m.Year == year)
    yearMap.set(year, {
      negative: sum(d.map((m) => m.NegativeCount)),
      positive: sum(d.map((m) => m.PositiveCount)),
      recordCount: sum(d.map((m) => m.RecordCount)),
    })
  })

  const dataResult = Array.from(yearMap.values())

  const chartOptions = getMultiDatasetBarChartOptions(theme.palette.mode, false, true)
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
        return `${result}${numeral(dataResult[tooltipItems.dataIndex].negative).format('###,###')} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
      }
      return `${result}${numeral(dataResult[tooltipItems.dataIndex].positive).format('###,###')} (${Number(tooltipItems.formattedValue).toFixed(2)}%)`
    },
    beforeFooter: (tooltipItems) => {
      return `___________________________`
    },
    footer: (tooltipItems) => {
      return ` total records: ${numeral(dataResult[tooltipItems[0].dataIndex].recordCount).format('###,###')}`
    },
  }

  const chartDataset: ChartData<'bar', number[], unknown> = {
    labels: labels,
    datasets: [
      {
        label: 'positive',
        data: dataResult.map((item) => {
          return calculatePercent(item.positive, item.recordCount)
        }),
        backgroundColor: CasinoGreenTransparent,
      },
      {
        label: 'negative',
        data: dataResult.map((item) => {
          return calculatePercent(item.negative, item.recordCount)
        }),
        backgroundColor: CasinoRedTransparent,
      },
    ],
  }

  const up = sum(dataResult.map((m) => m.positive))
  const down = sum(dataResult.map((m) => m.negative))
  const total = sum(dataResult.map((m) => m.recordCount))

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
      {startDate && endDate && (
        <Box py={2}>
          <Box display={'flex'} justifyContent={'space-around'}>
            <ReadOnlyField label='date range' val={`${dayjs(startDate).format('MM/DD/YYYY')} - ${dayjs(endDate).format('MM/DD/YYYY')}`} />
          </Box>
        </Box>
      )}

      <Box py={2} display={'flex'} justifyContent={'center'}>
        <FadeIn>
          <BasicPieChart barChart={pieChart} title='Earnings: positive / negative totals' />
        </FadeIn>
      </Box>
    </>
  )
}

export default AnnualEarningsReport

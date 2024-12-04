import { Box, Button, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { DateRangeFilter, StockEarningAggregate, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
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
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { mutate } from 'swr'
dayjs.extend(quarterOfYear)

const QuarterlyEarningsReport = ({ data, mutateKey }: { data: StockEarningAggregate[]; mutateKey: string }) => {
  const theme = useTheme()

  const labels = data.map((m) => {
    return `${m.Year} - Q${m.Quarter}`
  })

  const chartOptions = getMultiDatasetBarChartOptions({ palette: theme.palette.mode, showLegend: true })
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
    beforeFooter: (tooltipItems) => {
      return `___________________________`
    },
    footer: (tooltipItems) => {
      return ` total records: ${numeral(data[tooltipItems[0].dataIndex].RecordCount).format('###,###')}`
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
  const startDate = data.length > 0 ? getDateRangeForQuarter(data[0].Year, data[0].Quarter).startDate : null
  const endDate = data.length > 0 ? getDateRangeForQuarter(data[data.length - 1].Year, data[data.length - 1].Quarter).endDate : null

  const handlePreviousClick = async () => {
    if (startDate && endDate && data.length > 0) {
      let newStartDate = dayjs(startDate)
      let newEndDate = dayjs(endDate)
      let startYear = newStartDate.year()
      let startQ = newStartDate.quarter()
      let endYear = newEndDate.year()
      let endQ = newEndDate.quarter()

      if (startQ === 1) {
        startYear = startYear - 1
        startQ = 4
      } else {
        startQ = startQ - 1
      }

      if (endQ === 1) {
        endYear = endYear - 1
        endQ = 4
      } else {
        endQ = endQ - 1
      }

      const startDt = getDateRangeForQuarter(startYear, startQ).startDate
      const endDt = getDateRangeForQuarter(endYear, endQ).endDate
      const range: DateRangeFilter = {
        startDate: startDt,
        endDate: endDt,
      }
      const newResp = await serverPostFetch({ body: range }, '/EarningsReport')
      const result = newResp.Body as StockEarningAggregate[]
      mutate(mutateKey, result, { revalidate: false })
    }
  }
  const handleNextClick = async () => {
    if (startDate && endDate && data.length > 0) {
      let newStartDate = dayjs(startDate)
      let newEndDate = dayjs(endDate)
      let startYear = newStartDate.year()
      let startQ = newStartDate.quarter()
      let endYear = newEndDate.year()
      let endQ = newEndDate.quarter()

      if (startQ === 4) {
        startYear = startYear + 1
        startQ = 1
      } else {
        startQ = startQ + 1
      }

      if (endQ === 4) {
        endYear = endYear + 1
        endQ = 1
      } else {
        endQ = endQ + 1
      }

      const startDt = getDateRangeForQuarter(startYear, startQ).startDate
      const endDt = getDateRangeForQuarter(endYear, endQ).endDate
      const range: DateRangeFilter = {
        startDate: startDt,
        endDate: endDt,
      }
      const newResp = await serverPostFetch({ body: range }, '/EarningsReport')
      const result = newResp.Body as StockEarningAggregate[]
      mutate(mutateKey, result, { revalidate: false })
    }
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
      <Box pb={2}>
        <Box display={'flex'} justifyContent={'center'}>
          <Button variant='text' disabled={!startDate} onClick={handlePreviousClick}>
            <KeyboardArrowLeft />
          </Button>
          <Button variant='text' disabled={!endDate || (dayjs(endDate).year() == dayjs().year() && dayjs(endDate).quarter() === dayjs().quarter())} onClick={handleNextClick}>
            <KeyboardArrowRight />
          </Button>
        </Box>
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

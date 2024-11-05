import { Box, useTheme } from '@mui/material'
import { ChartData, ChartOptions } from 'chart.js'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { getPieChartOptions } from 'components/Atoms/Charts/chartJs/pieChartOptions'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import {
  CasinoBlue,
  CasinoGreenTransparent,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  DarkBlue,
  VeryLightBlue,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import { calculatePercent } from 'lib/util/numberUtil'

const EarningsReport = ({ data }: { data: StockEarning[] }) => {
  const theme = useTheme()
  const reported = sortArray(
    data.filter((m) => !!m.ReportDate && !!m.ActualEarnings && dayjs().isAfter(m.ReportDate)),
    ['ReportDate'],
    ['asc'],
  )
  const days = new Set(reported.map((m) => m.ReportDate))
  const up = reported.filter((m) => m.ActualEarnings! > 0)
  const down = reported.filter((m) => m.ActualEarnings! < 0)

  const pieChart: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent],
    labels: ['positive', 'negative'],
    borderColors: [CasinoGreenTransparent, CasinoRedTransparent],
    numbers: [calculatePercent(up.length, reported.length), calculatePercent(down.length, reported.length)],
  }

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

  const chartOptions: ChartOptions<'bar'> = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: theme.palette.mode === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 11,
          },
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: theme.palette.mode === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 11,
          },
          callback: (tickValue, index, ticks) => {
            return `${tickValue}%`
          },
        },
      },
    },
    indexAxis: 'x',
    responsive: true,
    plugins: {
      title: {
        padding: {
          bottom: 50,
          top: 10,
        },
        font: {
          size: 18,
          weight: 300,
        },
        display: true,
        text: 'Earnings: positive / negative',
        color: theme.palette.mode === 'light' ? CasinoBlue : VeryLightBlue,
      },
      legend: {
        display: false,
        position: 'top' as const,
      },
      tooltip: {
        padding: 16,
        backgroundColor: CasinoMoreBlackTransparent,
        titleColor: VeryLightBlue,
        footerAlign: 'left',
        footerSpacing: 10,
        footerMarginTop: 1,
        footerFont: {
          weight: 200,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        bodySpacing: 10,
        bodyAlign: 'left',
        usePointStyle: true,
        footerColor: VeryLightBlue,
        bodyColor: VeryLightBlue,
        callbacks: {
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

          labelPointStyle: (tooltiipItems) => {
            return {
              pointStyle: 'circle',
              rotation: 0,
              border: 4,
            }
          },
          footer: (tooltipItems) => {
            return ''
            //return `${tooltipItems[0].datasetIndex}`
            //return tooltipItems[0].formattedValue
          },
        },
      },
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
        <FadeIn>
          <BarChartStacked data={chartDataset} options={chartOptions} />
        </FadeIn>
      </Box>
      <Box py={2}>
        <CenterStack>
          <ReadOnlyField
            label='date range'
            val={`${reported.length > 0 ? `${dayjs(reported[0].ReportDate!).format('MM/DD/YYYY')} - ${dayjs(reported[reported.length - 1].ReportDate!).format('MM/DD/YYYY')}` : 'N/A'}`}
          />
        </CenterStack>
      </Box>
      <Box py={2} display={'flex'} justifyContent={'center'}>
        <Box>
          <FadeIn>
            <BasicPieChart barChart={pieChart} title='Positive / negative totals' />
          </FadeIn>
        </Box>
      </Box>
    </>
  )
}

export default EarningsReport

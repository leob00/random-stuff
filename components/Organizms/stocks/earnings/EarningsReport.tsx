import { Box, useTheme } from '@mui/material'
import { ChartData, ChartOptions } from 'chart.js'
import BarChartStacked from 'components/Atoms/Charts/chartJs/BarChartStacked'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import MultiDatasetBarchartExample from 'components/Atoms/Charts/chartJs/MultiDatasetBarchartExample'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import { BarChart, getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoGrayTransparent,
  CasinoGreenTransparent,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  DarkBlue,
  VeryLightBlue,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import { calculatePercent, getRandomInteger } from 'lib/util/numberUtil'

const EarningsReport = ({ data }: { data: StockEarning[] }) => {
  const theme = useTheme()
  const reported = sortArray(
    data.filter((m) => !!m.ReportDate && !!m.ActualEarnings && dayjs().isAfter(m.ReportDate)),
    ['ReportDate'],
    ['asc'],
  )
  //   const up = reported.filter((m) => m.ActualEarnings! > 0)
  //   const down = reported.filter((m) => m.ActualEarnings! < 0)
  //   const unchanged = reported.filter((m) => m.ActualEarnings! === 0)
  const days = new Set(reported.map((m) => m.ReportDate))

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
        titleColor: CasinoWhiteTransparent,
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
        footerColor: theme.palette.mode === 'light' ? DarkBlue : VeryLightBlue,
        bodyColor: theme.palette.mode === 'light' ? DarkBlue : VeryLightBlue,
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}`
          },
          afterLabel: (tooltipItems) => {
            return `${tooltipItems.dataset.label} ${Number(tooltipItems.formattedValue).toFixed(2)}%`
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
    <Box py={2}>
      <BarChartStacked data={chartDataset} options={chartOptions} />
    </Box>
  )
}

export default EarningsReport

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { CasinoBlack, CasinoBlue, CasinoBlueTransparent, CasinoRedTransparent, DarkBlue, DarkBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import { ApexBarChartData } from './chartModels'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexBarChart = ({
  data,
  horizontal = false,
  seriesName,
  yAxisDecorator = '',
  palette = 'dark',
}: {
  data: ApexBarChartData[]
  horizontal?: boolean
  seriesName: string
  yAxisDecorator?: string
  palette?: 'light' | 'dark'
}) => {
  const series: ApexAxisChartSeries = [
    {
      data: data,
      name: seriesName,
      color: CasinoBlueTransparent,
    },
  ]
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    grid: {
      show: false,
    },
    xaxis: {
      max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: !horizontal,
        style: {
          colors: palette === 'dark' ? [VeryLightBlue] : [CasinoBlack],
        },
      },
      axisTicks: { show: false },
    },
    yaxis: {
      decimalsInFloat: 0,
      max: 100,
      //forceNiceScale: true,
      labels: {
        style: {
          colors: palette === 'dark' ? [VeryLightBlue] : [CasinoBlack],
        },
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
      },
    },
    dataLabels: {
      style: {
        colors: palette === 'dark' ? [VeryLightBlue] : [CasinoBlack],
      },
      formatter: (val: number) => {
        return `${val}${yAxisDecorator}`
      },
    },
    tooltip: {
      theme: undefined,
      style: {
        fontSize: '16px',
      },
      y: {
        formatter: (val: number) => {
          return `${val}${yAxisDecorator}`
        },
      },
    },
  }

  return (
    <Box>
      <ReactApexChart series={series} options={options} type='bar' />
    </Box>
  )
}

export default ApexBarChart

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { CasinoBlue, CasinoBlueTransparent, CasinoRedTransparent, DarkBlue } from 'components/themes/mainTheme'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface ApexBarChartData {
  x: string
  y: number
  fillColor: string
}

const ApexBarChart = ({
  data,
  horizontal = false,
  seriesName,
  yAxisDecorator = '',
}: {
  data: ApexBarChartData[]
  horizontal?: boolean
  seriesName: string
  yAxisDecorator?: string
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
    },
    grid: {
      show: false,
    },
    xaxis: {
      labels: {},
      max: yAxisDecorator === '%' ? 100 : undefined,
    },
    yaxis: {
      forceNiceScale: true,
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: horizontal,
      },
    },
    dataLabels: {
      formatter: (val: number) => {
        return `${val}${yAxisDecorator}`
      },
    },
    tooltip: {
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

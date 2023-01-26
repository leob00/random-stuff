import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { CasinoBlue, DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import { XyValues } from './models/chartModes'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexLineChart = ({ data, seriesName, yAxisDecorator = '' }: { data: XyValues; seriesName: string; yAxisDecorator?: string }) => {
  const options: ApexOptions = {
    series: [
      {
        name: seriesName,
        data: data.y,
        color: DarkBlueTransparent,
      },
    ],
    stroke: {
      width: 2,
      colors: [DarkBlue],
    },
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },

    grid: {
      show: false,
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`
        },
      },
    },
    xaxis: {
      //max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: false,
        /* formatter: (val) => {
          return val
        }, */
      },
      categories: data.x,
      axisTicks: { show: false },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${yAxisDecorator}${val.toFixed(2)}`
        },
      },
    },
  }

  return (
    <Box>
      <ReactApexChart series={options.series} options={options} type='line' />
    </Box>
  )
}

export default ApexLineChart

import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { DarkBlueTransparent, DarkBlue, VeryLightBlueTransparent, CasinoBlueTransparent, CasinoBlue } from 'components/themes/mainTheme'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const StockChart = ({ data }: { data: XyValues }) => {
  const options: ApexOptions = {
    series: [
      {
        name: '',
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
      show: true,
      borderColor: VeryLightBlueTransparent,
    },
    yaxis: {
      labels: {
        style: {
          colors: [CasinoBlue],
        },
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`
        },
      },
    },
    xaxis: {
      //max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: false,
        formatter: (val) => {
          return val
        },
      },
      tickAmount: Math.floor(data.x.length / (data.x.length / 12)),
      categories: data.x,
      axisTicks: { show: false },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`
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

export default StockChart

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import {
  Blue800,
  CasinoBlack,
  CasinoBlackTransparent,
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoRedTransparent,
  DarkBlue,
  DarkBlueTransparent,
} from 'components/themes/mainTheme'
import { ApexBarChartData } from './ApexBarChart'
import { BarChart } from '../barChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexPieChart = ({ x, y, colors, yAxisDecorator = '' }: { x: string[]; y: number[]; colors: string[]; yAxisDecorator?: string }) => {
  var options: ApexOptions = {
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val}${yAxisDecorator}`
        },
      },
    },
    legend: {
      position: 'top',
    },
    stroke: {
      show: false,
    },
    grid: {
      show: false,
    },

    series: y,
    chart: {
      width: 380,
      type: 'donut',
    },
    labels: x,
    colors: colors,
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
      style: {
        colors: [CasinoBlack],
      },
    },

    plotOptions: {
      pie: {
        donut: {
          labels: {},
          size: '50%',
        },
      },
    },

    /*  responsive: [
      {
        //breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ], */
  }

  return (
    <Box>
      <ReactApexChart series={options.series} options={options} type='donut' />
    </Box>
  )
}

export default ApexPieChart

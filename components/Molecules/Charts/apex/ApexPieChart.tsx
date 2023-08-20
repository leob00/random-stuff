import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { CasinoBlack, VeryLightBlue, White } from 'components/themes/mainTheme'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexPieChart = ({
  x,
  y,
  colors,
  yAxisDecorator = '',
  palette = 'dark',
}: {
  x: string[]
  y: number[]
  colors: string[]
  yAxisDecorator?: string
  palette?: 'light' | 'dark'
}) => {
  var options: ApexOptions = {
    tooltip: {
      style: {
        fontSize: '16px',
      },
      y: {
        formatter: (val: number) => {
          return `${val}${yAxisDecorator}`
        },
      },
    },
    legend: {
      position: 'top',
      labels: {
        colors: palette === 'dark' ? [VeryLightBlue] : [CasinoBlack],
      },
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
        colors: [White],
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

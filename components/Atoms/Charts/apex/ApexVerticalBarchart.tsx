import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { CasinoBlue } from 'components/themes/mainTheme'
import { ApexBarChartData } from './chartModels'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexVerticalBarchart = ({ data, seriesName, yAxisDecorator = '' }: { data: ApexBarChartData[]; seriesName: string; yAxisDecorator?: string }) => {
  const series: ApexAxisChartSeries = [
    {
      data: data,
      name: seriesName,

      //color: 'red',
    },
  ]
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    grid: {
      show: true,
    },
    xaxis: {
      max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: true,
        style: {
          colors: data.map((item) => item.fillColor),
          fontWeight: 600,
          fontSize: '16px',
        },
      },
      axisTicks: { show: false },
    },
    yaxis: {
      decimalsInFloat: 0,
      //max: 100,
      forceNiceScale: true,

      labels: {
        formatter(val, opts?) {
          return `${val}${yAxisDecorator}`
        },
        style: {
          colors: [CasinoBlue],
          fontWeight: 400,
          fontSize: '14px',
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number) => {
        return `${val}${yAxisDecorator}`
      },
    },
    tooltip: {
      style: {
        fontSize: '14px',
      },
      //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //     return '<div class="arrow_box">' + '<span>' + series[seriesIndex][dataPointIndex] + '</span>' + '</div>'
      //   },
      y: {
        formatter: (val: number, opts: any) => {
          //return `<div style='color: ${opts.series[seriesIndex][dataPointIndex]};'>kaka: ${val}${yAxisDecorator}</div>`
          return `${val}${yAxisDecorator}`
        },
        title: {
          formatter(seriesName) {
            return seriesName
          },
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

export default ApexVerticalBarchart

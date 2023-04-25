import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { ApexBarChartData, XyValues } from './models/chartModes'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexAreaLineChart = ({ xyValues, isXmall = false }: { xyValues: XyValues; isXmall?: boolean }) => {
  const options = getOptions(xyValues, [], isXmall)
  return (
    <Box borderRadius={3} p={1}>
      <ReactApexChart series={options.series} options={options} type='area' />
    </Box>
  )
}

export default ApexAreaLineChart

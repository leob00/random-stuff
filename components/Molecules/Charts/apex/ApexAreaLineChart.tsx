import React from 'react'
import dynamic from 'next/dynamic'
import { Box, useTheme } from '@mui/material'
import { XyValues } from './models/chartModes'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
import { getBaseLineChartOptions } from './baseLineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexAreaLineChart = ({ xyValues, paletteMode = 'light', isXmall = false }: { xyValues: XyValues; paletteMode: 'light' | 'dark'; isXmall?: boolean }) => {
  const options = getBaseLineChartOptions(xyValues, { raw: xyValues.x, isXSmall: isXmall, palette: paletteMode, yLabelPrefix: '', changePositiveColor: false })
  return (
    <Box borderRadius={3} p={1}>
      <ReactApexChart series={options.series} options={options} type='area' height={280} />
    </Box>
  )
}

export default ApexAreaLineChart

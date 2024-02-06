import { Box, useMediaQuery, useTheme } from '@mui/material'
import { getBaseLineChartOptions, getMulitiLineChartOptions, getPositiveNegativeLineColor } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoBlue } from 'components/themes/mainTheme'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MultiLineChart = ({ xYValues, yLabelPrefix = '' }: { xYValues: XyValues[]; yLabelPrefix?: string }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520

  const chartOptions = getMulitiLineChartOptions(xYValues, [], false, theme.palette.mode, yLabelPrefix, undefined, true)

  return (
    <Box>
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />
    </Box>
  )
}

export default MultiLineChart

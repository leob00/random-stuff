import { Box, useMediaQuery, useTheme } from '@mui/material'
import { getBaseLineChartOptions, getPositiveNegativeLineColor } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MultiLineChart = ({ xYValues }: { xYValues: XyValues[] }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520

  const chartOptions = getBaseLineChartOptions(xYValues[0], xYValues, false, theme.palette.mode, '', undefined, true, xYValues[0].name)
  const series = chartOptions.series! as ApexAxisChartSeries
  for (let index = 1; index < xYValues.length; index++) {
    const element = xYValues[index]
    series.push({
      name: element.name ?? '',
      data: element.y,
      color: getPositiveNegativeLineColor(theme.palette.mode, element.y),
    })
  }

  chartOptions.series = series
  //console.log(chartOptions.series!)

  return (
    <Box>
      <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' height={chartHeight} />
    </Box>
  )
}

export default MultiLineChart

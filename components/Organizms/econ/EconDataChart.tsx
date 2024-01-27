import React from 'react'
import dynamic from 'next/dynamic'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { getOptions } from 'components/Organizms/stocks/lineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { getBaseLineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { EconomicDataItem, QlnLineChart } from 'lib/backend/api/qln/qlnModels'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconDataChart = ({ chart }: { chart: QlnLineChart }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const xyValues: XyValues = {
    x: chart.XValues,
    y: chart.YValues.map((m) => Number(m)),
  }

  const options = getBaseLineChartOptions(xyValues, xyValues.x, isXSmall, theme.palette.mode, '')

  return (
    <Box borderRadius={3} p={1}>
      <ReactApexChart series={options.series} options={options} type='area' height={chartHeight} />
    </Box>
  )
}

export default EconDataChart

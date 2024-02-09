import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import React from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MultiLineChart = ({ xYValues, yLabelPrefix = '' }: { xYValues: XyValues[]; yLabelPrefix?: string }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 260 : 280
  const [allOptions, setAllOptions] = React.useState<ApexOptions[]>([])

  React.useEffect(() => {
    const options: ApexOptions[] = xYValues.map((m, i) =>
      getBaseLineChartOptions(m, {
        raw: [],
        isXSmall: isXSmall,
        palette: theme.palette.mode,
        yLabelPrefix: yLabelPrefix,
        changePositiveColor: true,
        seriesName: m.name,
        groupName: 'multi',
        chartId: `chart-${m.name}`,
      }),
    )
    setAllOptions(options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      {allOptions.map((item) => (
        <Box key={item.chart?.id}>{item.chart && <ReactApexChart options={item} series={item.series} type='area' height={chartHeight} />}</Box>
      ))}
    </Box>
  )
}

export default MultiLineChart

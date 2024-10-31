import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MultiLineChart = ({ xYValues, yLabelPrefix = '' }: { xYValues: XyValues[]; yLabelPrefix?: string }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 260 : 280
  const [allOptions, setAllOptions] = useState<ApexOptions[]>([])

  const groupName = crypto.randomUUID()

  useEffect(() => {
    const options: ApexOptions[] = xYValues.map((m, i) =>
      getBaseLineChartOptions(m, {
        raw: [],
        isXSmall: isXSmall,
        palette: theme.palette.mode,
        yLabelPrefix: yLabelPrefix,
        changePositiveColor: true,
        seriesName: m.name,
        groupName: groupName,
        chartId: `chart-${m.name}`,
        enableAxisXTooltip: false,
      }),
    )
    setAllOptions(options)
    // console.log(options)
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

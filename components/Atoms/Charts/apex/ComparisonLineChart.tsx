import { Box, useMediaQuery, useTheme } from '@mui/material'
import { getMulitiLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ComparisonLineChart = ({ xYValues, yLabelPrefix = '' }: { xYValues: XyValues[]; yLabelPrefix?: string }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 260 : 280
  const options = getMulitiLineChartOptions(xYValues, [], isXSmall, theme.palette.mode, yLabelPrefix, undefined, true)

  return (
    <Box>
      <ReactApexChart options={options} series={options.series} type='area' height={chartHeight} />
    </Box>
  )
}

export default ComparisonLineChart

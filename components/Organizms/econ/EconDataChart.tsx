import dynamic from 'next/dynamic'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import { getBaseLineChartOptions } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { QlnLineChart } from 'lib/backend/api/qln/qlnModels'
import { getOptions } from '../stocks/lineChartOptions'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconDataChart = ({ chart }: { chart: QlnLineChart }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isXSmall ? 300 : 520
  const xyValues: XyValues = {
    x: chart.XValues,
    y: chart.YValues.map((m) => Number(m)),
  }

  // const options = getBaseLineChartOptions(xyValues, {
  //   raw: xyValues.x,
  //   isXSmall: isXSmall,
  //   palette: theme.palette.mode,
  //   yLabelPrefix: '',
  //   changePositiveColor: false,
  // })
  const options = getOptions(xyValues, [], false, theme.palette.mode, false)

  return (
    <Box borderRadius={3} p={1}>
      <ReactApexChart series={options.series} options={options} type='area' height={chartHeight} />
    </Box>
  )
}

export default EconDataChart

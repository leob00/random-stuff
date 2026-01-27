import { Box, Typography, useTheme } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import CenterStack from 'components/Atoms/CenterStack'
import { EconCalendarItem } from 'lib/backend/api/qln/qlnApi'
import ChartJsTimeSeriesLineChart, { TimeSeriesLineChartModel } from '../stocks/charts/ChartJsTimeSeriesLineChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'

const EconCalendarDetailHistory = ({ data }: { data: EconCalendarItem[] }) => {
  const theme = useTheme()
  let filtered = data.filter((m) => m.Actual)
  const lineChart: BarChart = {
    colors: [CasinoBlueTransparent],
    labels: filtered.map((m) => dayjs(m.EventDate).format('MM/DD/YYYY')),
    numbers: filtered.map((m) => m.Actual!),
  }
  const options = getLineChartOptions({ labels: lineChart.labels, numbers: lineChart.numbers }, `History`, undefined, theme.palette.mode, true, false)

  const chartModel: TimeSeriesLineChartModel = {
    chartData: lineChart,
    chartOptions: options,
    reverseColor: true,
  }

  return (
    <Box>
      <ChartJsTimeSeriesLineChart data={chartModel} />
    </Box>
  )
}
export default EconCalendarDetailHistory

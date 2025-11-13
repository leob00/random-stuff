'use client'
import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/pieChartOptions'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import CenterStack from 'components/Atoms/CenterStack'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { useMarketColors } from 'components/themes/marketColors'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'

const StockMarketStatsChart = ({ data, title }: { data: StockStats; title?: string }) => {
  const { chart } = useMarketColors()
  const chartData: BarChart = {
    colors: [chart.positiveColor, chart.negativeColor, chart.unchangedColor],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.TotalUpPercent, data.TotalDownPercent, data.TotalUnchangedPercent],
  }

  return (
    <Box>
      {title && <CenteredHeader title={title} variant='h5' />}
      <Box mt={-6}>
        <Box sx={{ margin: 'auto' }}>
          <BasicPieChart barChart={chartData} title={''} />
        </Box>
        <Box>
          <CenterStack sx={{ pt: 1 }}>
            <ReadOnlyField variant='caption' label='up' val={`${numeral(data.TotalUpPercent).format('0.000')}%`} />
          </CenterStack>
          <CenterStack>
            <ReadOnlyField variant='caption' label='down' val={`${numeral(data.TotalDownPercent).format('0.000')}%`} />
          </CenterStack>
          <CenterStack>
            <ReadOnlyField variant='caption' label='unchanged' val={`${numeral(data.TotalUnchangedPercent).format('0.000')}%`} />
          </CenterStack>
        </Box>
      </Box>
    </Box>
  )
}

export default StockMarketStatsChart

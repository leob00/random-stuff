'use client'
import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import { BarChart } from 'components/Atoms/Charts/chartJs/pieChartOptions'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import CenterStack from 'components/Atoms/CenterStack'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { useMarketColors } from 'components/themes/marketColors'

const StockMarketStatsChart = ({ data }: { data: StockStats }) => {
  const { chart } = useMarketColors()
  const chartData: BarChart = {
    colors: [chart.positiveColor, chart.negativeColor, chart.unchangedColor],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.TotalUpPercent, data.TotalDownPercent, data.TotalUnchangedPercent],
  }

  return (
    <Box>
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
  )
}

export default StockMarketStatsChart

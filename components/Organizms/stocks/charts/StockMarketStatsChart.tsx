'use client'
import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/chartJs/BasicPieChart'
import CenteredReadOnlyField from 'components/Atoms/Text/CenteredReadOnlyField'
import { BarChart } from 'components/Atoms/Charts/chartJs/pieChartOptions'
import { CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import CenterStack from 'components/Atoms/CenterStack'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'

const StockMarketStatsChart = ({ data }: { data: StockStats }) => {
  const chartData: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent, CasinoGrayTransparent],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.TotalUpPercent, data.TotalDownPercent, data.TotalUnchangedPercent],
  }

  return (
    <Box mt={-5}>
      <Box sx={{ margin: 'auto' }}>
        <BasicPieChart barChart={chartData} title={''} />
      </Box>
      <Box>
        <CenterStack sx={{ pt: 1 }}>
          <ReadOnlyField variant='caption' label='up' val={`${numeral(data.TotalUpPercent).format('0.00')}%`} py={0} />
        </CenterStack>
        <CenterStack>
          <ReadOnlyField variant='caption' label='down' val={`${numeral(data.TotalDownPercent).format('0.00')}%`} py={0} />
        </CenterStack>
        <CenterStack>
          <ReadOnlyField variant='caption' label='unchanged' val={`${numeral(data.TotalUnchangedPercent).format('0.00')}%`} py={0} />
        </CenterStack>
      </Box>
    </Box>
  )
}

export default StockMarketStatsChart

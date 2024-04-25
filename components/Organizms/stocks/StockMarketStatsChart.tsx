import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import { BarChart } from 'components/Molecules/Charts/pieChartOptions'
import { CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { MarketHandshake, StockStats } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockMarketStatsChart = ({ data }: { data: StockStats }) => {
  const chartData: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent, CasinoGrayTransparent],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.TotalUpPercent, data.TotalDownPercent, data.TotalUnchangedPercent],
  }

  return (
    <Box width={300} sx={{ margin: 'auto' }}>
      <BasicPieChart barChart={chartData} title={''} />
    </Box>
  )
}

export default StockMarketStatsChart

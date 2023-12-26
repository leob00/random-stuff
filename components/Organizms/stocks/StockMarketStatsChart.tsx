import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import { BarChart } from 'components/Molecules/Charts/pieChartOptions'
import { CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockMarketStatsChart = ({ data }: { data: MarketHandshake }) => {
  const chartData: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent, CasinoGrayTransparent],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.StockStats.TotalUpPercent, data.StockStats.TotalDownPercent, data.StockStats.TotalUnchangedPercent],
  }

  return (
    <Box width={300} sx={{ margin: 'auto' }}>
      <BasicPieChart barChart={chartData} title={''} />
    </Box>
  )
}

export default StockMarketStatsChart

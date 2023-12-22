import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import { CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockMarketStatsChart = ({ data }: { data: MarketHandshake }) => {
  return (
    <Box width={300} sx={{ margin: 'auto' }}>
      <BasicPieChart
        barChart={{
          colors: [CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent],
          labels: ['down', 'up', 'unchanged'],
          numbers: [data.StockStats.TotalDownPercent, data.StockStats.TotalUpPercent, data.StockStats.TotalUnchangedPercent],
        }}
        title={''}
      />
    </Box>
  )
}

export default StockMarketStatsChart

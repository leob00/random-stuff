import { Box } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { BarChart } from 'components/Molecules/Charts/pieChartOptions'
import { CasinoRedTransparent, CasinoGreenTransparent, CasinoGrayTransparent } from 'components/themes/mainTheme'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import React from 'react'

const StockMarketStatsChart = ({ data }: { data: StockStats }) => {
  const chartData: BarChart = {
    colors: [CasinoGreenTransparent, CasinoRedTransparent, CasinoGrayTransparent],
    labels: ['up', 'down', 'unchanged'],
    numbers: [data.TotalUpPercent, data.TotalDownPercent, data.TotalUnchangedPercent],
  }

  return (
    <>
      <Box width={300} sx={{ margin: 'auto' }}>
        <BasicPieChart barChart={chartData} title={''} />
      </Box>
      <Box pt={2} pl={{ xs: 'unset', sm: '20%', lg: '36%' }}>
        <ReadOnlyField label={'up'} val={`${numeral(data.TotalUpPercent).format('0.00')}%`} labelLength={130} />
        <ReadOnlyField label={'down'} val={`${numeral(data.TotalDownPercent).format('0.00')}%`} labelLength={130} />
        <ReadOnlyField label={'unchanged'} val={`${numeral(data.TotalUnchangedPercent).format('0.00')}%`} labelLength={130} />
      </Box>
    </>
  )
}

export default StockMarketStatsChart

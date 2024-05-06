import { Box, Typography } from '@mui/material'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import CenteredReadOnlyField from 'components/Atoms/Text/CenteredReadOnlyField'
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
      <Box py={4}>
        <CenteredReadOnlyField label={'up'} val={`${numeral(data.TotalUpPercent).format('0.00')}%`} labelLength={300} />
        <CenteredReadOnlyField label={'down'} val={`${numeral(data.TotalDownPercent).format('0.00')}%`} />
        <CenteredReadOnlyField label={'unchanged'} val={`${numeral(data.TotalUnchangedPercent).format('0.00')}%`} />
      </Box>
    </>
  )
}

export default StockMarketStatsChart

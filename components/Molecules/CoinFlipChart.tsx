import { Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { BarChart } from './Charts/barChartOptions'
import SimpleBarChart from './Charts/SimpleBarChart'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  return (
    <>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Typography>{`total filps: ${totalFlips}`}</Typography>
      </CenterStack>
      <CenterStack sx={{ paddingTop: 6 }}>
        <SimpleBarChart labels={chart.labels} numbers={chart.numbers} colors={chart.colors} />
      </CenterStack>
    </>
  )
}

export default CoinFlipChart

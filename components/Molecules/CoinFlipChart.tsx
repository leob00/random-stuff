import { Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { BarChart } from './Charts/barChartOptions'
import SimpleBarChart2 from './Charts/SimpleBarChart2'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  return (
    <>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Typography>{`total filps: ${totalFlips}`}</Typography>
      </CenterStack>
      <CenterStack sx={{ paddingTop: 6 }}>
        <SimpleBarChart2 title='Coin Flip Stats' barChart={chart} />
      </CenterStack>
    </>
  )
}

export default CoinFlipChart

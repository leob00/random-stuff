import { Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import BasicBarChart from 'components/Atoms/Charts/chartJs/BasicBarChart'
import { BarChart } from '../Atoms/Charts/chartJs/barChartOptions'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  return (
    <>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Typography>{`total filps: ${totalFlips}`}</Typography>
      </CenterStack>
      <CenterStack sx={{ paddingTop: 6 }}>
        <BasicBarChart title='Coin Flip Stats' barChart={chart} />
      </CenterStack>
    </>
  )
}

export default CoinFlipChart

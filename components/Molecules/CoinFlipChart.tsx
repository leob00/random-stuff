import { Box, Typography, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { BarChart, getBarChartOptions } from '../Atoms/Charts/chartJs/barChartOptions'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  const theme = useTheme()
  const options = { ...getBarChartOptions('Coin Flip Stats', '', theme.palette.mode) }

  if (chart.numbers.length <= 10) {
    options.scales!.y!.ticks = { ...options.scales!.y!.ticks, precision: 1, stepSize: 1 }
  }

  return (
    <>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Typography>{`total filps: ${totalFlips}`}</Typography>
      </CenterStack>
      <Box>
        <SimpleBarChart barChart={chart} chartOptions={options} height={75} />
      </Box>
    </>
  )
}

export default CoinFlipChart

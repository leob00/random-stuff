import { Box, Typography, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { BarChart, getBarChartOptions } from '../Atoms/Charts/chartJs/barChartOptions'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import numeral from 'numeral'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  const theme = useTheme()
  const options = { ...getBarChartOptions('', '', theme.palette.mode) }

  if (chart.numbers.length <= 10) {
    options.scales!.y! = { ...options.scales!.y!, max: totalFlips }
    options.scales!.y!.ticks = { ...options.scales!.y!.ticks, precision: 1, stepSize: 1 }
    options.plugins!.tooltip!.callbacks = {
      ...options.plugins!.tooltip?.callbacks,
      label: (tooltipItems) => {
        return ` ${[tooltipItems.label]}: ${Number(tooltipItems.formattedValue)}`
      },
    }
  }

  return (
    <>
      <CenterStack sx={{ paddingBottom: 2 }}>
        <Typography>{`total flips: ${numeral(totalFlips).format('###,###')}`}</Typography>
      </CenterStack>
      <Box>
        <SimpleBarChart barChart={chart} chartOptions={options} height={75} />
      </Box>
    </>
  )
}

export default CoinFlipChart

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { BarChart, getBarChartData, getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import numeral from 'numeral'

const CoinFlipChart = ({ totalFlips, chart }: { totalFlips: number; chart: BarChart }) => {
  const theme = useTheme()
  const options = { ...getBarChartOptions('', '', theme.palette.mode) }
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))

  let height: number | undefined = undefined
  if (isXSmall) {
    height = 240
  }
  if (isLarge) {
    height = 320
  }

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
        <SimpleBarChart barChart={chart} chartOptions={options} height={height} />
      </Box>
    </>
  )
}

export default CoinFlipChart

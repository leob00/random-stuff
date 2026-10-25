import { Box, Typography, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'
import StockChange from './StockChange'

const HistoricalAggregateDisplay = ({ aggregate }: { aggregate: HistoricalAggregate }) => {
  const theme = useTheme()
  const color = getPositiveNegativeColor(aggregate.Change, theme.palette.mode)

  const MovingAvgDisplay = () => {
    return (
      <Box pl={2} py={1}>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Typography variant='subtitle2' color='info'>
            change:
          </Typography>
          <Typography variant='h6' fontWeight={600} color={color}>{`${numeral(aggregate.Change).format('+###,###,0.00')}`}</Typography>
          <Typography variant='h6' fontWeight={600} color={color}>{`${numeral(aggregate.Percentage).format('+###,###,0.000')}%`}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={2} px={0.5} justifyContent={'flex-start'}>
      <Box>
        <FadeIn duration={0.75}>{MovingAvgDisplay()}</FadeIn>
      </Box>
    </Box>
  )
}

export default HistoricalAggregateDisplay

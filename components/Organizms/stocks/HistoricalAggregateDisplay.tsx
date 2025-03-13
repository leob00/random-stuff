import { Box, Typography, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import { getPositiveNegativeColor } from './StockListItem'
import FadeOut from 'components/Atoms/Animations/FadeOut'
import numeral from 'numeral'

const HistoricalAggregateDisplay = ({ aggregate, isLoading }: { aggregate: HistoricalAggregate; isLoading: boolean }) => {
  const theme = useTheme()

  const MovingAvgDisplay = () => {
    return (
      <Box p={'8px'}>
        <Box display={'flex'} gap={2}>
          <Typography
            variant='h5'
            fontWeight={600}
            color={getPositiveNegativeColor(aggregate.Change, theme.palette.mode)}
          >{`$${numeral(aggregate.Change).format('###,###,0.00')}`}</Typography>
          <Typography
            variant='h5'
            fontWeight={600}
            color={getPositiveNegativeColor(aggregate.Percentage, theme.palette.mode)}
          >{`${aggregate.Percentage}%`}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={2} px={2} justifyContent={'flex-start'}>
      <Box>
        {!isLoading ? (
          <Box>
            <FadeIn>{MovingAvgDisplay()}</FadeIn>
          </Box>
        ) : (
          <Box>
            <FadeOut>{MovingAvgDisplay()}</FadeOut>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default HistoricalAggregateDisplay

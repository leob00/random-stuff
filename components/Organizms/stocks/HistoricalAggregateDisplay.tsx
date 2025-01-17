import { Box, Typography, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import { getPositiveNegativeColor } from './StockListItem'
import FadeOut from 'components/Atoms/Animations/FadeOut'

const HistoricalAggregateDisplay = ({ aggregate, isLoading }: { aggregate: HistoricalAggregate; isLoading: boolean }) => {
  const theme = useTheme()

  const MovingAvgDisplay = () => {
    return (
      <Box p={'8px'} borderRadius={'.8rem'} sx={{}}>
        <Typography
          variant='h5'
          fontWeight={600}
          color={getPositiveNegativeColor(aggregate.Percentage, theme.palette.mode)}
        >{`${aggregate.Percentage}%`}</Typography>
      </Box>
    )
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={2} px={2} justifyContent={'flex-start'}>
      <Box>
        <Typography variant='h6'>{`moving avg:`}</Typography>
      </Box>
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

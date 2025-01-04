import { Box, Typography, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { HistoricalAggregate } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import FadeOut from 'components/Atoms/Animations/FadeOut'

const HistoricalAggregateDisplay = ({ aggregate, isLoading }: { aggregate: HistoricalAggregate; isLoading: boolean }) => {
  const theme = useTheme()
  return (
    <Box display={'flex'} alignItems={'center'} gap={2} px={2}>
      <Box>
        <Typography variant='h6'>{`Moving avg:`}</Typography>
      </Box>
      <Box>
        {!isLoading ? (
          <Box>
            <FadeIn>
              <Box>
                <Typography
                  variant='h5'
                  fontWeight={600}
                  color={getPositiveNegativeColor(aggregate.Percentage, theme.palette.mode)}
                >{`${aggregate.Percentage}%`}</Typography>
              </Box>
            </FadeIn>
          </Box>
        ) : (
          <Box>
            <FadeOut>
              <Box>
                <Typography
                  variant='h5'
                  fontWeight={600}
                  color={getPositiveNegativeColor(aggregate.Percentage, theme.palette.mode)}
                >{`${aggregate.Percentage}%`}</Typography>
              </Box>
            </FadeOut>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default HistoricalAggregateDisplay

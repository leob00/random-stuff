import { Box, Typography, useTheme } from '@mui/material'
import { MovingAvg } from 'lib/backend/api/qln/qlnModels'
import { getPositiveNegativeColor } from '../StockListItem'
import numeral from 'numeral'
import CenterStack from 'components/Atoms/CenterStack'

const MovingAvgValues = ({ values, startAt = 0 }: { values: MovingAvg[]; startAt?: number }) => {
  const theme = useTheme()
  return (
    <>
      <CenterStack sx={{ pb: 2 }}>
        <Typography variant='body2'>moving average</Typography>
      </CenterStack>
      <Box sx={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
        <Box>
          <Box display={'flex'} gap={{ xs: 2, sm: 3, md: 4 }} alignItems={'center'} justifyContent={{ sx: 'flex-start', sm: 'center' }}>
            {values
              .filter((m) => m.UnitValue >= startAt)
              .map((item) => (
                <Box key={item.UnitValue}>
                  <Typography variant='caption'>{`${item.UnitValue} day`}</Typography>
                  <Typography
                    color={getPositiveNegativeColor(item.CurrentValue, theme.palette.mode)}
                  >{`${numeral(item.CurrentValue).format('###,###,0.00')}%`}</Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default MovingAvgValues

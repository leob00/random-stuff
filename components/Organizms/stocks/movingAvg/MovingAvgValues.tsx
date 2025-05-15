import { Box, Typography, useTheme } from '@mui/material'
import { MovingAvg } from 'lib/backend/api/qln/qlnModels'
import { getPositiveNegativeColor } from '../StockListItem'
import numeral from 'numeral'

const MovingAvgValues = ({ values }: { values: MovingAvg[] }) => {
  const theme = useTheme()
  return (
    <>
      <Box display={'flex'} gap={2} alignItems={'center'} justifyContent={'center'} flexWrap={'wrap'}>
        {values.map((item) => (
          <Box key={item.UnitValue}>
            <Typography variant='caption'>{`${item.UnitValue} day`}</Typography>
            <Typography
              color={getPositiveNegativeColor(item.CurrentValue, theme.palette.mode)}
            >{`${numeral(item.CurrentValue).format('###,###,0.00')}%`}</Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}
export default MovingAvgValues

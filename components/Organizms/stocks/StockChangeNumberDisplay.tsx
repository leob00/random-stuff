import { Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'

import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'

const StockChangeNumberDisplay = ({ value, endSymbol = '' }: { value: number; endSymbol?: string }) => {
  const theme = useTheme()
  return (
    <Typography
      variant='h6'
      fontWeight={600}
      color={getPositiveNegativeColor(value, theme.palette.mode)}
    >{`${numeral(value).format('###,###,0.00')}${endSymbol}`}</Typography>
  )
}

export default StockChangeNumberDisplay

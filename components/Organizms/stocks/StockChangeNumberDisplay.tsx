import { Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'

import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'

const StockChangeNumberDisplay = ({ value, endSymbol = '', overwriteColor }: { value: number; endSymbol?: string; overwriteColor?: string }) => {
  const theme = useTheme()
  const color = overwriteColor ?? getPositiveNegativeColor(value, theme.palette.mode)
  return <Typography variant='h6' fontWeight={600} color={color}>{`${numeral(value).format('###,###,0.00')}${endSymbol}`}</Typography>
}

export default StockChangeNumberDisplay

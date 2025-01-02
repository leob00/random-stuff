import { Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'

import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'

const StockChange = ({ item }: { item: StockQuote }) => {
  const theme = useTheme()
  return (
    <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} alignItems={'center'}>
      <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
        <Typography
          variant='h6'
          color={getPositiveNegativeColor(item.Change, theme.palette.mode)}
        >{`${numeral(item.Price).format('###,###,0.00')}`}</Typography>
        <Typography
          variant='h6'
          color={getPositiveNegativeColor(item.Change, theme.palette.mode)}
        >{`${numeral(item.Change).format('###,###,0.000')}`}</Typography>
        <Typography variant='h6' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
      </Stack>
    </Stack>
  )
}

export default StockChange

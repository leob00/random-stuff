import { Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'

import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'
import StockChangeNumberDisplay from './StockChangeNumberDisplay'

const StockChange = ({ item }: { item: StockQuote }) => {
  const theme = useTheme()
  return (
    <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} alignItems={'center'}>
      <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
        <StockChangeNumberDisplay value={item.Price} />
        <StockChangeNumberDisplay value={item.Change} />
        <StockChangeNumberDisplay value={item.ChangePercent} endSymbol='%' />
      </Stack>
    </Stack>
  )
}

export default StockChange

import { Stack, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPositiveNegativeColor } from './StockListItem'
import StockChangeNumberDisplay from './StockChangeNumberDisplay'

const StockChange = ({ item, showMovingAvg = false, changeDecimalPlaces = 2 }: { item: StockQuote; showMovingAvg?: boolean; changeDecimalPlaces?: number }) => {
  const theme = useTheme()
  return (
    <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} alignItems={'center'}>
      {showMovingAvg && item.MovingAvg ? (
        <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
          <StockChangeNumberDisplay value={item.Price} overwriteColor={getPositiveNegativeColor(item.MovingAvgChange!, theme.palette.mode)} />
          <StockChangeNumberDisplay value={item.MovingAvgChange!} />
          <StockChangeNumberDisplay value={item.MovingAvg} endSymbol='%' />
        </Stack>
      ) : (
        <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
          <StockChangeNumberDisplay value={item.Price} overwriteColor={getPositiveNegativeColor(item.ChangePercent, theme.palette.mode)} />
          <StockChangeNumberDisplay value={item.Change} changeDecimalPlaces={changeDecimalPlaces} />
          <StockChangeNumberDisplay value={item.ChangePercent} endSymbol='%' />
        </Stack>
      )}
    </Stack>
  )
}

export default StockChange

import { Stack, Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

const EconChangeHeader = ({ last, reverseColor = false }: { last: StockHistoryItem; reverseColor?: boolean }) => {
  const theme = useTheme()
  const color = reverseColor ? getPositiveNegativeColorReverse(last.Change, theme.palette.mode) : getPositiveNegativeColor(last.Change, theme.palette.mode)
  return (
    <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} alignItems={'center'}>
      <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
        <Typography variant='h6' color={color}>{`${numeral(last.Price).format('###,###,0.00')}`}</Typography>
        <Typography variant='h6' color={color}>{`${last.Change}`}</Typography>
        <Typography variant='h6' color={color}>{`${last.ChangePercent}%`}</Typography>
      </Stack>
    </Stack>
  )
}

export default EconChangeHeader

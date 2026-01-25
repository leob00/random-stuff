import { Box, Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor, getPositiveNegativeColorReverse } from 'components/Organizms/stocks/StockListItem'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

const EconChangeHeader = ({ last, reverseColor = false, showLabel = false }: { last: StockHistoryItem; reverseColor?: boolean; showLabel?: boolean }) => {
  const theme = useTheme()
  const color = reverseColor ? getPositiveNegativeColorReverse(last.Change, theme.palette.mode) : getPositiveNegativeColor(last.Change, theme.palette.mode)
  return (
    <Box>
      <Box display={'flex'} gap={2} sx={{ minWidth: '25%' }} alignItems={'center'}>
        {showLabel && <Typography variant='caption'>last:</Typography>}
        <Typography variant='h6' color={color}>{`${numeral(last.Price).format('###,###,0.00')}`}</Typography>
        <Typography variant='h6' color={color}>{`${numeral(last.Change).format('###,###,0.00')}`}</Typography>
        <Typography variant='h6' color={color}>{`${numeral(last.ChangePercent).format('###,###,0.00')}%`}</Typography>
      </Box>
    </Box>
  )
}

export default EconChangeHeader

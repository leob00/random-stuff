import { Box, Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'

const QuickQuote = ({ quote, prependCompanyName }: { quote: StockQuote; prependCompanyName?: string }) => {
  const theme = useTheme()
  return (
    <Box>
      {prependCompanyName ? (
        <Typography variant='h5'>{`${prependCompanyName} ${quote.Company} (${quote.Symbol})`}</Typography>
      ) : (
        <Typography variant='h5'>{`${quote.Company} (${quote.Symbol})`}</Typography>
      )}
      <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
        <Stack direction={'row'} spacing={2} sx={{ backgroundColor: 'unset' }} pt={1}>
          <Typography variant='h5' color={getPositiveNegativeColor(quote.Change, theme.palette.mode)}>{`${quote.Price.toFixed(2)}`}</Typography>
          <Typography variant='h5' color={getPositiveNegativeColor(quote.Change, theme.palette.mode)}>{`${quote.Change.toFixed(2)}`}</Typography>
          <Typography variant='h5' color={getPositiveNegativeColor(quote.Change, theme.palette.mode)}>{`${quote.ChangePercent.toFixed(2)}%`}</Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default QuickQuote

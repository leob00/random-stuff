import { Stack, Typography, useTheme } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'

const StockChange = ({ item }: { item: StockQuote }) => {
  const theme = useTheme()
  return (
    <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
      <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }} pt={1}>
        <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.Price.toFixed(2)}`}</Typography>
        <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.Change.toFixed(2)}`}</Typography>
        <Typography variant='h5' color={getPositiveNegativeColor(item.Change, theme.palette.mode)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
      </Stack>
    </Stack>
  )
}

export default StockChange

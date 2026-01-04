'use client'
import { Box, Tooltip, Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { CasinoBlueTransparent, DarkModeBkg } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import { ReactElement } from 'react'

const StockTooltip = ({ data, children }: { data: StockQuote; children: ReactElement<unknown, any> }) => {
  const theme = useTheme()
  const customContent = (
    <Box minWidth={250} display={'flex'} flexDirection={'column'} gap={1}>
      <Typography variant='h6' textAlign={'left'}>
        {data.Company}
      </Typography>

      <Box display={'flex'} gap={1}>
        <Typography variant='h6' color={getPositiveNegativeColor(data.Change, theme.palette.mode)}>{`${numeral(data.Price).format('###,0.00')}`}</Typography>
        <Typography color={getPositiveNegativeColor(data.Change, theme.palette.mode)} variant='h6'>{`${numeral(data.Change).format('###,0.000')}`}</Typography>
        <Typography
          color={getPositiveNegativeColor(data.Change, theme.palette.mode)}
          variant='h6'
        >{`${numeral(data.ChangePercent).format('###,0.000')}%`}</Typography>
      </Box>
      <Box display={'flex'} gap={1}>
        {data.MarketCap && (
          <>
            <Typography variant='caption'>{`cap:`}</Typography>
            <Typography variant='caption'>{`${numeral(data.MarketCap).format('0.0a')}`}</Typography>
          </>
        )}
        {data.Volume && (
          <>
            <Typography variant='caption'>{`volume:`}</Typography>
            <Typography variant='caption'>{`${numeral(data.Volume).format('0.0a')}`}</Typography>
          </>
        )}
      </Box>
    </Box>
  )
  return (
    <Tooltip
      title={customContent}
      placement='top-start'
      slotProps={{
        arrow: {
          sx: {
            //color: DarkModeBkg,
            // backgroundColor: DarkModeBkg,
            //boxSizing: 'content-box',
            //border: `1px solid ${CasinoBlueTransparent}`,
            '&::before': {
              // This is where you add the border styling
              border: `1px solid ${theme.palette.mode === 'dark' ? CasinoBlueTransparent : DarkModeBkg}`,
              backgroundColor: DarkModeBkg, // Must match the tooltip background color for a seamless look
              //boxSizing: 'border-box',
            },
          },
        },
        tooltip: {
          sx: {
            border: `1px solid ${theme.palette.mode === 'dark' ? CasinoBlueTransparent : DarkModeBkg}`,
            borderRadius: 2,
          },
        },
      }}
      arrow
    >
      {children}
    </Tooltip>
  )
}

export default StockTooltip

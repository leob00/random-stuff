'use client'
import { Box, ListItem, ListItemText, Tooltip, Typography, useTheme } from '@mui/material'
import { CasinoBlueTransparent, DarkModeBkg, VeryLightBlue } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import { ReactElement } from 'react'

const StockTooltip = ({ data, children }: { data: StockQuote; children: ReactElement<unknown, any> }) => {
  const theme = useTheme()
  const customContent = (
    <Box minWidth={250}>
      <Typography variant='h6' textAlign={'left'}>
        {data.Company}
      </Typography>
      {/* <Typography>This is some detailed information with a list:</Typography> */}
      <ListItem disablePadding>
        <ListItemText secondary={<Typography variant='body2'>{`Cap: ${numeral(data.MarketCap).format('0.0a')}`}</Typography>} />
      </ListItem>
      <ListItem disablePadding>
        <ListItemText secondary={<Typography variant='body2'>{`Volume: ${numeral(data.Volume).format('0.0a')}`}</Typography>} />
      </ListItem>
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

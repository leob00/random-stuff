'use client'
import { Box, ListItem, ListItemText, Tooltip, Typography, useTheme } from '@mui/material'
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
    <Tooltip title={customContent} placement='top-start' arrow={false}>
      {children}
    </Tooltip>
  )
}

export default StockTooltip

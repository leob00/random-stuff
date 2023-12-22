import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockMarketStatus = ({ data }: { data: MarketHandshake }) => {
  return (
    <Box py={2}>
      <CenterStack>
        <Typography>{`${data.IsOpen ? 'U.S markets are open' : 'U.S markets are closed'}`}</Typography>
      </CenterStack>
      <CenterStack>
        <Typography variant='caption'>{`${data.MarketsOpenClosedMessage}`}</Typography>
      </CenterStack>
    </Box>
  )
}
export default StockMarketStatus

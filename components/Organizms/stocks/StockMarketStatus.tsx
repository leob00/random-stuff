import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockMarketStatus = ({ data }: { data: MarketHandshake }) => {
  return (
    <Box>
      <CenterStack>
        <Typography variant='caption'>{`${data.IsOpen ? 'U.S markets are open' : 'U.S markets are closed'}`}</Typography>
      </CenterStack>
      <Box display={'flex'} justifyContent={'center'}>
        <Typography textAlign={'center'} variant='caption'>{`${data.MarketsOpenClosedMessage}`}</Typography>
      </Box>
    </Box>
  )
}
export default StockMarketStatus

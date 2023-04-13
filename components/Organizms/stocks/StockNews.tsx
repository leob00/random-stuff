import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'

const StockNews = ({ quote }: { quote: StockQuote }) => {
  return (
    <Box pb={2} pt={2}>
      <CenteredHeader title={`News`} />
      <Typography>coming soon...</Typography>
    </Box>
  )
}

export default StockNews

import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({ stockList, isStock }: { stockList: StockQuote[]; isStock: boolean }) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item, index) => (
          <Box key={item.Symbol}>
            <StockListItem item={item} isStock={isStock} />
          </Box>
        ))}
        {stockList.length > 0 ? (
          <CenterStack>
            <Typography variant={'caption'}>{`prices are as of: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
          </CenterStack>
        ) : (
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body2'>No data found.</Typography>
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockTable

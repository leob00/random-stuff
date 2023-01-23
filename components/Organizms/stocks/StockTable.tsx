import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({ stockList, onRemoveItem }: { stockList: StockQuote[]; onRemoveItem: (id: string) => void }) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item, index) => (
          <StockListItem key={index} index={index} item={item} totalCount={stockList.length} onRemoveItem={onRemoveItem} />
        ))}
        {stockList.length > 0 && (
          <Typography fontSize={10}>{`All quote prices are as of: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        )}
      </Box>
    </>
  )
}

export default StockTable

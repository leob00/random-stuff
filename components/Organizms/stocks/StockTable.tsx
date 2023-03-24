import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({ stockList, onRemoveItem }: { stockList: StockQuote[]; onRemoveItem: (id: string) => void }) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item, index) => (
          <StockListItem key={item.Symbol} item={item} />
        ))}
        {stockList.length > 0 ? (
          <Typography variant={'body2'}>{`All quote prices are as of: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        ) : (
          <CenterStack>
            <Typography>no stocks found</Typography>
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockTable

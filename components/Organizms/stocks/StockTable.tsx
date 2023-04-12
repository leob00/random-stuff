import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({ stockList }: { stockList: StockQuote[] }) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item, index) => (
          <Box key={item.Symbol}>
            <StockListItem item={item} />
          </Box>
        ))}
        {stockList.length > 0 ? (
          <CenterStack>
            <Typography variant={'caption'}>{`prices are as of: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
          </CenterStack>
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}

export default StockTable

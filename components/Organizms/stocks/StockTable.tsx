import { Box, Stack, Typography } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'
import { MarketCategory } from 'lib/backend/api/qln/chartApi'

const StockTable = ({
  stockList,
  marketCategory,
  scrollIntoView,
  scrollMargin = -10,
  showGroupName = true,
  showSummary = true,
  featuredField,
}: {
  stockList: StockQuote[]
  marketCategory: MarketCategory
  scrollIntoView?: boolean
  scrollMargin?: number
  showGroupName?: boolean
  showSummary?: boolean
  featuredField?: keyof StockQuote
}) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item) => (
          <Box key={`${item.Symbol}`}>
            <StockListItem item={item} marketCategory={marketCategory} showGroupName={showGroupName} featuredField={featuredField} scrollIntoView />
          </Box>
        ))}
        {stockList.length > 0 ? (
          <>
            {showSummary && (
              <Box>
                {scrollIntoView && <ScrollIntoView enabled={showSummary} margin={scrollMargin} />}
                <Stack>
                  <Typography variant={'caption'}>{`last updated: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
                </Stack>
              </Box>
            )}
          </>
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

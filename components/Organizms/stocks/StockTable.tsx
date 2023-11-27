import { Box, Stack, Typography, useTheme } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({
  stockList,
  isStock,
  scrollIntoView,
  scrollMargin = -10,
  showGroupName = true,
  showSummary = true,
  userProfile,
}: {
  stockList: StockQuote[]
  isStock: boolean
  scrollIntoView?: boolean
  scrollMargin?: number
  showGroupName?: boolean
  showSummary?: boolean
  userProfile?: UserProfile | null
}) => {
  return (
    <>
      <Box pl={1}>
        {stockList.map((item, index) => (
          <Box key={item.Symbol}>
            <StockListItem item={item} isStock={isStock} showGroupName={showGroupName} userProfile={userProfile} />
          </Box>
        ))}
        {stockList.length > 0 ? (
          <>
            {showSummary && (
              <Box>
                {scrollIntoView && <ScrollIntoView enabled={showSummary} margin={scrollMargin} />}
                <Stack>
                  <Typography variant={'caption'}>{`prices are as of: ${dayjs(stockList[0].TradeDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
                </Stack>
                <Typography variant={'caption'}>{`total count: ${numeral(stockList.length).format()}`}</Typography>
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

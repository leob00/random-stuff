import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import React from 'react'
import StockListItem from './StockListItem'

const StockTable = ({
  stockList,
  isStock,
  scrollIntoView,
  scrollMargin = -20,
  showGroupName = true,
  showSummary = true,
}: {
  stockList: StockQuote[]
  isStock: boolean
  scrollIntoView?: boolean
  scrollMargin?: number
  showGroupName?: boolean
  showSummary?: boolean
}) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)

  // React.useEffect(() => {
  //   let isCanceled = false
  //   if (!isCanceled) {
  //     if (scrollIntoView) {
  //       if (scrollTarget.current) {
  //         scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
  //       }
  //     }
  //   }
  //   return () => {
  //     isCanceled = true
  //   }
  // }, [scrollIntoView])

  return (
    <>
      <Box pl={1}>
        <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: scrollMargin }}></Typography>

        {stockList.map((item, index) => (
          <Box key={item.Symbol}>
            <StockListItem item={item} isStock={isStock} showGroupName={showGroupName} />
          </Box>
        ))}
        {stockList.length > 0 ? (
          <>
            {showSummary && (
              <Box>
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

import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'
import StockListItem, { getPositiveNegativeColor } from './StockListItem'
import { orderBy, mean } from 'lodash'
import StockTable from './StockTable'

interface Model {
  groupName: string
  movingAvg: number
  quotes: StockQuote[]
}

const GroupedStocksLayout = ({ stockList }: { stockList: StockQuote[] }) => {
  const allStocks = [...stockList]
  allStocks.forEach((item) => {
    if (!item.GroupName) {
      item.GroupName = ''
    }
  })
  const groupSet = new Set(allStocks.map((item) => item.GroupName!))
  let groupedList: { groupName: string; movingAvg: number; quotes: StockQuote[] }[] = []
  groupSet.forEach((i) => {
    groupedList.push({
      groupName: i,
      movingAvg: mean(allStocks.filter((o) => o.GroupName === i).map((o) => o.ChangePercent)),
      quotes: allStocks.filter((o) => o.GroupName === i),
    })
  })
  groupedList = orderBy(groupedList, ['groupName', ['asc']])

  return (
    <Box py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {groupedList.map((item, i) => (
          <Box key={item.groupName}>
            <Box
              sx={{ backgroundColor: VeryLightBlueTransparent }}
              py={1}
              pl={1}
              display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box>
                <Typography variant='h4' pl={1} fontWeight={600} color='primary'>
                  {`${!item.groupName || item.groupName.length === 0 ? 'Unassigned' : item.groupName}`}
                </Typography>
              </Box>
              <Box pr={1}>
                <Typography variant='h5' pl={1} fontWeight={600} color={getPositiveNegativeColor(item.movingAvg)}>
                  {`${item.movingAvg.toFixed(2)}%`}
                </Typography>
              </Box>
            </Box>
            {/* <StockTable isStock={true} stockList={item.quotes} key={i} /> */}
            {/* {item.quotes.map((quote, i) => (
              <StockListItem key={i} isStock={true} item={quote} showGroupName={false} />
            ))} */}
          </Box>
        ))}
      </Box>
      {/* {Array.from(groupMap.keys()).map((key) => (
        <Box key={key} display={'flex'} flexDirection={'column'} gap={1}>
          <Typography variant='h4'>{key}</Typography>
        </Box>
      ))} */}
    </Box>
  )
}

export default GroupedStocksLayout

import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getMapFromArray } from 'lib/util/collectionsNative'
import React from 'react'
import StockListItem, { getPositiveNegativeColor } from './StockListItem'
import { orderBy, mean } from 'lodash'

const GroupedStocksLayout = ({ stockList }: { stockList: StockQuote[] }) => {
  stockList.forEach((item) => {
    if (!item.GroupName) {
      item.GroupName = 'Unassigned'
    }
  })
  const groupSet = new Set(stockList.map((item) => item.GroupName!))
  const groupedList: { groupName: string; movingAvg: number; quotes: StockQuote[] }[] = []
  groupSet.forEach((i) => {
    groupedList.push({
      groupName: i,
      movingAvg: mean(stockList.filter((o) => o.GroupName === i).map((o) => o.ChangePercent)),
      quotes: stockList.filter((o) => o.GroupName === i),
    })
  })
  //const groupMap = getMapFromArray(stockList, 'GroupName')
  //console.log(groupMap)
  return (
    <Box py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {groupedList.map((item) => (
          <Box key={item.groupName}>
            <Box sx={{ backgroundColor: VeryLightBlueTransparent }} py={1} pl={1} display={'flex'} gap={2} alignItems={'center'}>
              <Box>
                <Typography variant='h4' pl={1} fontWeight={600} color='primary'>
                  {item.groupName}
                </Typography>
              </Box>
              <Box>
                <Typography variant='h5' pl={1} fontWeight={600} color={getPositiveNegativeColor(item.movingAvg)}>
                  {`${item.movingAvg.toFixed(2)}%`}
                </Typography>
              </Box>
            </Box>
            {item.quotes.map((quote, i) => (
              <StockListItem key={i} isStock={true} item={quote} showGroupName={false} />
            ))}
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

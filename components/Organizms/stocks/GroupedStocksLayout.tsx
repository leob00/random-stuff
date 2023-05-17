import { Box, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import { orderBy, mean, cloneDeep } from 'lodash'
import StockTable from './StockTable'
import { getMapFromArray } from 'lib/util/collectionsNative'

interface Model {
  id: string
  isExpanded: boolean
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
  let groupedList: Model[] = []
  groupSet.forEach((i) => {
    groupedList.push({
      id: crypto.randomUUID(),
      isExpanded: false,
      groupName: i,
      movingAvg: mean(allStocks.filter((o) => o.GroupName === i).map((o) => o.ChangePercent)),
      quotes: allStocks.filter((o) => o.GroupName === i),
    })
  })
  groupedList = orderBy(groupedList, ['movingAvg', 'groupName'], ['desc', 'asc'])
  const groupMap = getMapFromArray(groupedList, 'id')
  const [data, setData] = React.useState(groupMap)

  const handleExpandCollapseGroup = (item: Model) => {
    const newMap = new Map(data)
    const newItem = newMap.get(item.id)
    if (newItem) {
      newItem.isExpanded = !item.isExpanded
      newMap.set(newItem.id, newItem)
      setData(newMap)
    }
  }

  return (
    <Box py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {Array.from(data.values()).map((item, i) => (
          <Box key={item.groupName}>
            <Box
              sx={{ backgroundColor: VeryLightBlueTransparent, cursor: 'pointer' }}
              py={1}
              pl={1}
              display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => handleExpandCollapseGroup(item)}
            >
              <Box sx={{}}>
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
            {item.isExpanded && <StockTable isStock={true} stockList={item.quotes} key={item.id} />}
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

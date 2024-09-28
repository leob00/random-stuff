import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { mean } from 'lodash'
import GroupedListMenu from './GroupedListMenu'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { sortArray } from 'lib/util/collections'
import { useUserController } from 'hooks/userController'
import GroupedStockTable from './GroupedStockTable'

export interface StockGroup {
  id: string
  isExpanded: boolean
  groupName: string
  movingAvg: number
  quotes: StockQuote[]
}

const GroupedStocksLayout = ({
  userProfile,
  stockList,
  onEdit,
  onShowAsGroup,
}: {
  userProfile: UserProfile | null
  stockList: StockQuote[]
  onEdit: () => void
  onShowAsGroup: (show: boolean) => void
}) => {
  const userController = useUserController()

  const groupify = (list: StockQuote[]) => {
    const groupSet = new Set(list.map((item) => item.GroupName!))
    let groupedList: StockGroup[] = []
    groupSet.forEach((i) => {
      groupedList.push({
        id: crypto.randomUUID(),
        isExpanded: false,
        groupName: i,
        movingAvg: mean(list.filter((o) => o.GroupName === i).map((o) => o.ChangePercent)),
        quotes: list.filter((o) => o.GroupName === i),
      })
    })
    return groupedList
  }

  const allStocks = [...stockList]

  allStocks.forEach((item) => {
    if (!item.GroupName || item.GroupName === 'Unassigned') {
      item.GroupName = item.Sector ?? ''
    }
  })
  let groupedList = groupify(allStocks)
  const groupedSort = userProfile?.settings?.stocks?.sort?.grouped

  if (groupedSort) {
    if (userController.authProfile) {
      groupedList = sortArray(
        groupedList,
        groupedSort.main.map((m) => m.key),
        groupedSort.main.map((m) => m.direction),
      )
    }
  }

  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} pb={2}>
        <GroupedListMenu onEdit={onEdit} onShowAsGroup={onShowAsGroup} />
      </Box>
      <GroupedStockTable result={groupedList} />
    </Box>
  )
}

export default GroupedStocksLayout

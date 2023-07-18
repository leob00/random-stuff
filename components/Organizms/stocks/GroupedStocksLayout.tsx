import { Box, Typography } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import { orderBy, mean, cloneDeep } from 'lodash'
import StockTable from './StockTable'
import { getMapFromArray } from 'lib/util/collectionsNative'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import GroupedListMenu from './GroupedListMenu'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { sortArray } from 'lib/util/collections'
import { useUserController } from 'hooks/userController'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import NoDataFound from 'components/Atoms/Text/NoDataFound'

interface Model {
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
  scrollIntoView,
}: {
  userProfile: UserProfile | null
  stockList: StockQuote[]
  onEdit: () => void
  onShowAsGroup: (show: boolean) => void
  scrollIntoView?: boolean
}) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const userController = useUserController()

  const groupify = (list: StockQuote[]) => {
    const groupSet = new Set(list.map((item) => item.GroupName!))
    let groupedList: Model[] = []
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
  //console.log(groupedList)
  const groupMap = getMapFromArray(groupedList, 'id')
  const [data, setData] = React.useState(groupMap)
  const [originalData] = React.useState(groupMap)

  const handleExpandCollapseGroup = (item: Model) => {
    const newMap = new Map(data)
    const newItem = newMap.get(item.id)
    if (newItem) {
      newItem.isExpanded = !item.isExpanded
      if (item.isExpanded) {
        if (userController.authProfile) {
          const p = { ...userController.authProfile }
          let insideSort = p.settings?.stocks?.sort?.grouped.inside
          let mainSort = p.settings?.stocks?.sort?.grouped.main
          if (insideSort) {
            newItem.quotes = sortArray(
              newItem.quotes,
              insideSort.map((m) => m.key),
              insideSort.map((m) => m.direction),
            )
          } else {
            p.settings!.stocks!.sort = {
              grouped: {
                main: [{ key: 'movingAvg', direction: 'desc' }],
                inside: [{ key: 'Company', direction: 'asc' }],
              },
            }
            putUserProfile(p)
            newItem.quotes = sortArray(newItem.quotes, ['Company'], ['asc'])
            userController.setProfile(p)
          }
        }
      }
      newMap.set(newItem.id, newItem)
      setData(newMap)
    }
  }
  const handleSearchGroupWithinList = (text: string) => {
    const result = Array.from(originalData.values()).filter((o) => o.groupName.toLowerCase().includes(text.toLowerCase()))
    const map = getMapFromArray(result, 'id')
    setData(map)
  }
  React.useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [scrollIntoView])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} pb={2}>
        <Box pl={1}>
          <SearchWithinList onChanged={handleSearchGroupWithinList} debounceWaitMilliseconds={150} />
        </Box>
        <GroupedListMenu onEdit={onEdit} onShowAsGroup={onShowAsGroup} />
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {Array.from(data.values()).map((item, index) => (
          <Box key={item.groupName}>
            {index == 0 && <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -20 }}></Typography>}
            <Box
              sx={{ backgroundColor: VeryLightBlueTransparent, cursor: 'pointer', borderRadius: 1.2 }}
              py={2}
              pl={1}
              display={'flex'}
              gap={2}
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => handleExpandCollapseGroup(item)}
            >
              <Box>
                <Typography variant='h5' pl={1} color='primary'>
                  {`${!item.groupName || item.groupName.length === 0 ? 'Unassigned' : item.groupName}`}
                </Typography>
              </Box>

              <Box pr={2}>
                <Typography variant='h5' pl={1} color={getPositiveNegativeColor(item.movingAvg)}>
                  {`${item.movingAvg.toFixed(2)}%`}
                </Typography>
              </Box>
            </Box>

            {item.isExpanded && (
              <>
                <StockTable isStock={true} stockList={item.quotes} key={item.id} scrollIntoView />
              </>
            )}
          </Box>
        ))}
        <>
          {Array.from(data.values()).length === 0 && (
            <Box>
              <NoDataFound message='We were unable to find any results that match your search critera.' />
            </Box>
          )}
        </>
      </Box>
    </Box>
  )
}

export default GroupedStocksLayout

import { Box, Typography } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { useUserController } from 'hooks/userController'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'
import { replaceItemInArray, sortArray } from 'lib/util/collections'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'

const GroupedStockTable = ({ result, scrollIntoView = false }: { result: StockGroup[]; scrollIntoView?: boolean }) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const userController = useUserController()
  const [data, setData] = React.useState(result)

  const handleExpandCollapseGroup = (item: StockGroup) => {
    const newData = [...data]
    const newItem = data.find((m) => m.id === item.id)
    if (newItem) {
      newItem.isExpanded = !item.isExpanded
      if (item.isExpanded) {
        if (userController.authProfile) {
          const p = { ...userController.authProfile }
          let insideSort = p.settings?.stocks?.sort?.grouped.inside
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
      replaceItemInArray(newItem, newData, 'id', newItem.id)
      //newMap.set(newItem.id, newItem)
      setData(newData)
    }
  }
  React.useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [scrollIntoView])

  return (
    <Box minHeight={650}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {data.map((item, index) => (
          <Box key={item.groupName}>
            {index == 0 && <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -20 }}></Typography>}
            <Box sx={{ backgroundColor: VeryLightBlueTransparent, cursor: 'pointer', borderRadius: 1.2 }} py={2} pl={1} display={'flex'} gap={2} alignItems={'center'} justifyContent={'space-between'} onClick={() => handleExpandCollapseGroup(item)}>
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
                <StockTable isStock={true} stockList={item.quotes} key={item.id} scrollIntoView scrollMargin={-20} showGroupName={false} showSummary={false} />
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

export default GroupedStockTable

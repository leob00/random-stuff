import { Box, Typography, useTheme } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useUserController } from 'hooks/userController'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import GroupedStockItem from './GroupedStockItem'

const GroupedStockTable = ({ result, scrollIntoView = false }: { result: StockGroup[]; scrollIntoView?: boolean }) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)

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
        {result.map((item, index) => (
          <Box key={item.groupName}>
            {index == 0 && <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -28 }}></Typography>}
            <GroupedStockItem group={item} />
          </Box>
        ))}
        <>
          {result.length === 0 && (
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

import { Box, Typography, useTheme } from '@mui/material'
import { DarkBlue, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'

const GroupedStockItem = ({ group }: { group: StockGroup }) => {
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandCollapse = () => {
    setExpanded(!expanded)
  }
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{ backgroundColor: theme.palette.mode === 'dark' ? DarkBlue : VeryLightBlueTransparent, cursor: 'pointer', borderRadius: 1.2 }}
        py={2}
        pl={1}
        display={'flex'}
        gap={2}
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={handleExpandCollapse}
      >
        <Box>
          <Typography variant='h5' pl={1} color='primary'>
            {`${!group.groupName || group.groupName.length === 0 ? 'Unassigned' : group.groupName}`}
          </Typography>
        </Box>

        <Box pr={2}>
          <Typography variant='h5' pl={1} color={getPositiveNegativeColor(group.movingAvg, theme.palette.mode)}>
            {`${group.movingAvg.toFixed(2)}%`}
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <>
          <StockTable isStock={true} stockList={group.quotes} key={group.id} scrollIntoView scrollMargin={-20} showGroupName={false} showSummary={false} />
        </>
      )}
    </>
  )
}

export default GroupedStockItem
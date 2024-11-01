import { Box, Typography, useTheme } from '@mui/material'
import { DarkModeBlue } from 'components/themes/mainTheme'
import { StockGroup } from './GroupedStocksLayout'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'
import { useState } from 'react'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const GroupedStockItem = ({ stockGroup }: { stockGroup: StockGroup }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandCollapse = () => {
    setExpanded(!expanded)
  }
  const theme = useTheme()
  return (
    <Box>
      <FadeIn>
        <Box sx={{ cursor: 'pointer', borderRadius: 1.2, backgroundColor: DarkModeBlue }} py={2} pl={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'} onClick={handleExpandCollapse}>
          <Box>
            <Typography variant='h6' pl={1} color='primary'>
              {`${!stockGroup.groupName || stockGroup.groupName.length === 0 ? 'Unassigned' : stockGroup.groupName}`}
            </Typography>
          </Box>

          <Box pr={2}>
            <Typography variant='h6' pl={1} color={getPositiveNegativeColor(stockGroup.movingAvg, theme.palette.mode)}>
              {`${stockGroup.movingAvg.toFixed(2)}%`}
            </Typography>
          </Box>
        </Box>

        {expanded && (
          <>
            {/* <ScrollIntoView enabled={expanded} margin={-20} /> */}
            <StockTable isStock={true} stockList={stockGroup.quotes} showGroupName={false} showSummary={false} scrollIntoView={expanded} />
          </>
        )}
      </FadeIn>
    </Box>
  )
}

export default GroupedStockItem

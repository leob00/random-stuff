import { Box, Paper, Typography, useTheme } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { CasinoGrayTransparent, DarkBlue, DarkModeBlue, DarkModeBlueTransparent, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'

const GroupedStockItem = ({ group, userProfile }: { group: StockGroup; userProfile?: UserProfile | null }) => {
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandCollapse = () => {
    setExpanded(!expanded)
  }
  const theme = useTheme()
  return (
    <Box>
      <Box
        sx={{ cursor: 'pointer', borderRadius: 1.2, backgroundColor: DarkModeBlue }}
        py={2}
        pl={1}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={handleExpandCollapse}
      >
        <Box>
          <Typography variant='h6' pl={1} color='primary'>
            {`${!group.groupName || group.groupName.length === 0 ? 'Unassigned' : group.groupName}`}
          </Typography>
        </Box>

        <Box pr={2}>
          <Typography variant='h6' pl={1} color={getPositiveNegativeColor(group.movingAvg, theme.palette.mode)}>
            {`${group.movingAvg.toFixed(2)}%`}
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <>
          <ScrollIntoView enabled={expanded} margin={-20} />
          <StockTable isStock={true} stockList={group.quotes} key={group.id} showGroupName={false} showSummary={false} scrollIntoView={expanded} />
        </>
      )}
    </Box>
  )
}

export default GroupedStockItem

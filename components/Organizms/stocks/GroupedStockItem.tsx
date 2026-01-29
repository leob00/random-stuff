import { Box, Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material'
import { StockGroup } from './GroupedStocksLayout'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'
import { useState } from 'react'
import Clickable from 'components/Atoms/Containers/Clickable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const GroupedStockItem = ({ stockGroup, userProfile }: { stockGroup: StockGroup; userProfile: UserProfile | null }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandCollapse = () => {
    setExpanded(!expanded)
  }
  const theme = useTheme()
  return (
    <Box>
      <Clickable onClicked={handleExpandCollapse}>
        <Card>
          <CardContent>
            <Box pt={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
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
          </CardContent>
        </Card>
      </Clickable>
      {expanded && (
        <>
          <StockTable
            marketCategory={'stocks'}
            stockList={stockGroup.quotes}
            showGroupName={false}
            showSummary={false}
            scrollIntoView={expanded}
            userProfile={userProfile}
          />
        </>
      )}
    </Box>
  )
}

export default GroupedStockItem

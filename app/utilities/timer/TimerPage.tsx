import { Box, Typography } from '@mui/material'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
import StockMarketSummaryDisplay from 'components/Organizms/stocks/summary/StockMarketSummaryDisplay'
import TimerDisplay from 'components/Organizms/time/TimerDisplay'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { MarketHandshake } from 'lib/backend/api/qln/qlnModels'

export default async function TimerPage() {
  return (
    <Box>
      <TimerDisplay />
    </Box>
  )
}

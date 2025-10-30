import { StockStats } from 'lib/backend/api/qln/qlnModels'
import StockMarketStatsChart from '../charts/StockMarketStatsChart'
import { mean } from 'lodash'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { Box } from '@mui/material'

const StockSentimentDisplay = ({ data }: { data: StockStats[] }) => {
  return (
    <>
      <CenteredHeader title={'1 Week'} variant='h5' />
      <Box>
        <Box mt={-5}>
          <StockMarketStatsChart data={getSentiment(data, 7)} />
        </Box>
        <HorizontalDivider />
        <CenteredHeader title={'2 Weeks'} variant='h5' />
        <Box mt={-5}>
          <StockMarketStatsChart data={getSentiment(data, 14)} />
        </Box>
        <HorizontalDivider />
        <CenteredHeader title={'1 Month'} variant='h5' />
        <Box mt={-5}>
          <StockMarketStatsChart data={getSentiment(data, 30)} />
        </Box>
        <HorizontalDivider />
      </Box>
    </>
  )
}

function getSentiment(data: StockStats[], days: number) {
  const all = [...data]
  const items = all.slice(0, days)
  const upAvg = mean(items.map((m) => m.TotalUpPercent))
  const downAvg = mean(items.map((m) => m.TotalDownPercent))
  const unchangedAvg = mean(items.map((m) => m.TotalUnchangedPercent))
  const result: StockStats = {
    TotalUp: 0,
    TotalDown: 0,
    TotalUnchanged: 0,
    TotalUpPercent: upAvg,
    TotalDownPercent: downAvg,
    TotalUnchangedPercent: unchangedAvg,
    MarketDate: '',
    DateModified: '',
  }
  return result
}

export default StockSentimentDisplay

import { Box, Typography } from '@mui/material'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import { StockStats } from 'lib/backend/api/models/zModels'
import SummaryTitle from '../SummaryTitle'
import StockMarketStatsChart from '../../charts/StockMarketStatsChart'
import dayjs from 'dayjs'

const SentimentSummary = ({
  data,
  onRefresh,
  onGoToPage,
  isLoading,
}: {
  data?: StockStats | null
  onRefresh: () => void
  onGoToPage: () => void
  isLoading?: boolean
}) => {
  const model: StockStats = data ?? {
    MarketDate: '',
    TotalUpPercent: 0,
    DateModified: '',
    TotalDownPercent: 0,
    TotalUnchangedPercent: 0,
    TotalDown: 0,
    TotalUp: 0,
    TotalUnchanged: 0,
  }

  return (
    <Box>
      <BorderedBox width={'100%'} minWidth={300} minHeight={513}>
        <Box minWidth={300} minHeight={513}>
          <Box>
            <SummaryTitle title={`Daily Sentiment`} onRefresh={onRefresh} onGoToPage={onGoToPage} />
            <Typography variant='body2' textAlign={'center'}>{`${model.MarketDate ? dayjs(model.MarketDate).format('MM/DD/YYYY') : '-'}`}</Typography>
            <StockMarketStatsChart data={model} isLoading={isLoading} />
          </Box>
        </Box>
      </BorderedBox>
    </Box>
  )
}

export default SentimentSummary

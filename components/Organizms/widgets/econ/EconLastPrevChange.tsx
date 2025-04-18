import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import EconChangeHeader from './EconChangeHeader'
import { reverseColor } from './EconWidget'
import { Box } from '@mui/material'

const EconLastPrevChange = ({ item }: { item: EconomicDataItem }) => {
  const historyItem: StockHistoryItem = {
    Price: item.Value,
    Change: item.Value - (item.PreviousValue ?? 0),
    Symbol: item.Title,
    TradeDate: item.LastObservationDate ?? '',
  }

  historyItem.ChangePercent = calculateStockMovePercent(item.PreviousValue ?? 0, historyItem.Change ?? 0)
  const shouldReverseColor = reverseColor(item.InternalId)
  return (
    <Box pl={1}>
      <EconChangeHeader last={historyItem} reverseColor={shouldReverseColor} />
    </Box>
  )
}

export default EconLastPrevChange

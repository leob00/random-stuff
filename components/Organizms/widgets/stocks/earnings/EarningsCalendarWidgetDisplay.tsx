import { Box } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { getDefaultDateOption } from 'components/Organizms/stocks/earnings/earningsCalendar'
import StockEarningsCalendarList from './StockEarningsCalendarList'

const EarningsCalendarWidgetDisplay = ({ data, maxHeight }: { data: StockEarning[]; maxHeight?: number }) => {
  const dateToSelect = getDefaultDateOption(data)

  return (
    <>
      <Box>
        <Box py={2}>
          {dateToSelect && (
            <Box>
              <StockEarningsCalendarList data={data} maxHeight={maxHeight} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}

export default EarningsCalendarWidgetDisplay

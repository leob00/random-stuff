import { Box } from '@mui/material'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import StockReportsWrapper from 'components/Organizms/stocks/reports/StockReportsWrapper'
import TopMovingAvg from 'components/Organizms/stocks/reports/TopMovingAvg'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { DropdownItem } from 'lib/models/dropdown'

export const stockReportsDropdown: DropdownItem[] = [
  { text: 'Volume Leaders', value: 'volume-leaders' },
  { text: 'Market Cap Leaders', value: 'market-cap-leaders' },
  { text: 'Top Movers', value: 'topmvgavg' },
  { text: 'Sectors', value: 'sectors' },
  { text: 'Industries', value: 'industries' },
  { text: 'Dividend Payers', value: 'dividend-payers' },
  { text: 'Stock Tags', value: 'stock-tags' },
  { text: 'Indices and ETFs', value: 'indicesAndEtfs' },
]

const StockReportsPage = ({ id }: { id: string }) => {
  let selectedOption = stockReportsDropdown.find((m) => m.value === id)
  if (!selectedOption) {
    selectedOption = stockReportsDropdown[0]
  }
  return (
    <>
      <StockReportsDropdown selectedValue={selectedOption.value} />
      <Box py={2}>
        {selectedOption.value !== 'topmvgavg' ? <StockReportsWrapper reportType={selectedOption.value as StockReportTypes} /> : <TopMovingAvg />}
      </Box>
    </>
  )
}

export default StockReportsPage

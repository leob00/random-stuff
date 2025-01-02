import { Box } from '@mui/material'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'

const StockChartDaySelect = ({ selectedDays, onSelected }: { selectedDays: number; onSelected: (arg: number) => void }) => {
  const handleDaysSelected = (arg: number | null) => {
    if (arg) {
      onSelected(arg)
    }
  }

  return (
    <Box textAlign={'right'} pr={1} py={1}>
      <FormDropdownListNumeric options={stockChartDaySelect} value={selectedDays} onOptionSelected={handleDaysSelected} />
    </Box>
  )
}

export const stockChartDaySelect: DropdownItemNumeric[] = [
  { text: '1 week', value: 7 },
  { text: '1 month', value: 30 },
  { text: '3 months', value: 90 },
  { text: '6 months', value: 180 },
  { text: '1 year', value: 365 },
  { text: '3 year', value: 1095 },
  { text: '5 year', value: 1825 },
]

export default StockChartDaySelect

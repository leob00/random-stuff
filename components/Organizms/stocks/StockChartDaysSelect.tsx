import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { DropdownItem } from 'lib/models/dropdown'

export const stockChartDaySelect: DropdownItem[] = [
  { text: '1 week', value: '7' },
  { text: '1 month', value: '30' },
  { text: '3 months', value: '90' },
  { text: '6 months', value: '180' },
  { text: '1 year', value: '365' },
  { text: '3 year', value: '1095' },
  { text: '5 year', value: '1825' },
]

const StockChartDaysSelect = ({ selectedOption, onSelected }: { selectedOption: string; onSelected: (val: string) => void }) => {
  return <UncontrolledDropdownList options={stockChartDaySelect} selectedOption={selectedOption} onOptionSelected={onSelected} />
}

export default StockChartDaysSelect

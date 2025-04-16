import { Box } from '@mui/material'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import dayjs from 'dayjs'
import { DateRange } from 'lib/backend/api/qln/qlnApi'
import { DropdownItemNumeric } from 'lib/models/dropdown'

const StockChartDaySelect = ({
  selectedDays,
  onSelected,
  availableDates,
}: {
  selectedDays: number
  onSelected: (arg: number) => void
  availableDates?: DateRange
}) => {
  const handleDaysSelected = (arg: number | null) => {
    if (arg !== null) {
      onSelected(arg)
    }
  }
  const options: DropdownItemNumeric[] = availableDates
    ? stockChartDaySelect.filter((m) => m.value <= dayjs().diff(dayjs(availableDates.StartDate), 'days'))
    : getstockChartDays()

  return (
    <Box textAlign={'right'} pr={1} py={1}>
      <FormDropdownListNumeric options={options} value={selectedDays} onOptionSelected={handleDaysSelected} />
    </Box>
  )
}

export const stockChartDaySelect: DropdownItemNumeric[] = [
  { text: '1 week', value: 7 },
  { text: '1 month', value: 30 },
  { text: '3 months', value: 90 },
  { text: '6 months', value: 180 },
  { text: 'YTD', value: 0 },
  { text: '1 year', value: 365 },
  { text: '3 year', value: 1095 },
  { text: '5 year', value: 1825 },
]

export function getstockChartDays() {
  let result: DropdownItemNumeric[] = []
  const shortTerm: DropdownItemNumeric[] = [
    { text: '1 week', value: 7 },
    { text: '1 month', value: 30 },
    { text: '3 months', value: 90 },
    { text: '6 months', value: 180 },
  ]
  const longTerm: DropdownItemNumeric[] = [
    { text: '1 year', value: 365 },
    { text: '3 year', value: 1095 },
    { text: '5 year', value: 1825 },
  ]
  shortTerm.push({
    text: 'YTD',
    value: -1,
  })
  result = [...shortTerm, ...longTerm]
  return result
}

export function getYearToDateDays() {
  let now = dayjs()
  const jan1 = new Date(now.year(), 0, 1)
  const jan1StartDt = dayjs(jan1)
  const ytdDays = now.diff(jan1StartDt, 'day')
  return ytdDays
}

export default StockChartDaySelect

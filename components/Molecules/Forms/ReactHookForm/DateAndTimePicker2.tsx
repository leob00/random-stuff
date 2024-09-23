import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { forwardRef } from 'react'

type Props = {
  label?: string
  errorMessage?: string
  value?: string | null
  minDate?: string
  maxDate?: string
  onDateSelected: (arg: string | null) => void
}

const DateAndTimePicker2 = forwardRef<HTMLInputElement, Props>(function DateAndTimePicker(props: Props, _ref) {
  const { label, errorMessage, value, minDate, maxDate, onDateSelected } = props

  const handleSelect = (dt: dayjs.Dayjs | null) => {
    if (dt) {
      onDateSelected(dayjs(dt).format())
    } else {
      onDateSelected(null)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleSelect}
        slotProps={{
          textField: {
            size: 'small',
            error: !!errorMessage,
            helperText: errorMessage,
          },
        }}
      />
    </LocalizationProvider>
  )
})

export default DateAndTimePicker2

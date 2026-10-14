import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { forwardRef } from 'react'

type Props = {
  label?: string
  placeholder?: string
  errorMessage?: string
  value?: string | null
  minDate?: string
  maxDate?: string
  onDateSelected: (arg: string | null) => void
  allowNull?: boolean
}

const FormDatePicker = forwardRef<HTMLInputElement, Props>(function FormDatePicker(props: Props, _ref) {
  const { label, placeholder, errorMessage, value, minDate, maxDate, onDateSelected, allowNull = false } = props

  const handleSelect = (dt: dayjs.Dayjs | null) => {
    if (dt) {
      if (dt.isValid()) {
        onDateSelected(dayjs(dt).format())
      }
    } else if (!allowNull) {
      onDateSelected(null)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        value={value ? dayjs(value) : null}
        onChange={handleSelect}
        slotProps={{
          field: { clearable: !!allowNull },
          textField: {
            placeholder: placeholder,
            size: 'small',
            error: !!errorMessage,
            helperText: errorMessage,
            autoCorrect: 'off',
          },
        }}
      />
    </LocalizationProvider>
  )
})

export default FormDatePicker

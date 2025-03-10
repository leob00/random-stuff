import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { DateTimeValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'

const DateAndTimePicker = ({
  defaultValue,
  label,
  onChanged,
  disabled = false,
}: {
  defaultValue?: string
  label: string
  onChanged: (value?: string) => void
  disabled?: boolean
}) => {
  const [value, setValue] = useState<dayjs.Dayjs | undefined | null>(defaultValue !== undefined ? dayjs(defaultValue) : null)

  const handleChange = (val: dayjs.Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => {
    const dt = val
    if (!dt) {
      setValue(null)
      onChanged(undefined)
      return
    } else {
      setValue(dayjs(dt))
      onChanged(dayjs(dt).format())
    }
  }
  const handleClear = () => {
    setValue(null)
  }

  useEffect(() => {
    setValue(defaultValue ? dayjs(defaultValue) : null)
  }, [defaultValue])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={value ? dayjs(value) : null}
        disabled={disabled}
        key={label}
        label={label}
        onChange={handleChange}
        slotProps={{
          textField: {
            size: 'small',
          },
        }}
      />
    </LocalizationProvider>
  )
}

export default DateAndTimePicker

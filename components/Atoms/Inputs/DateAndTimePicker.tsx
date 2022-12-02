import React from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'
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
  const [value, setValue] = React.useState<dayjs.Dayjs | undefined | null>(defaultValue ? dayjs(defaultValue) : null)

  const handleChange = (val?: string | null, keyboardInputValue?: string | undefined) => {
    const dt = val ?? keyboardInputValue
    if (!dt) {
      //console.log('sending date: ', dt)
      setValue(undefined)
      onChanged(undefined)
      return
    } else {
      setValue(dayjs(dt))
      onChanged(dayjs(dt).format())
    }
  }

  React.useEffect(() => {
    setValue(defaultValue ? dayjs(defaultValue) : null)
  }, [defaultValue])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        //disabled={disabled}
        key={label}
        renderInput={(props) => <TextField autoComplete={'off'} size='small' {...props} />}
        label={label}
        value={value ?? null}
        onChange={handleChange}
      />
    </LocalizationProvider>
  )
}

export default DateAndTimePicker

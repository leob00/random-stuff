import React from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'
const DateAndTimePicker = ({ defaultValue, label, onChanged }: { defaultValue?: string; label: string; onChanged: (value?: string) => void }) => {
  const [value, setValue] = React.useState(defaultValue ? dayjs(defaultValue) : null)

  const handleChange = (val: string | null, keyboardInputValue?: string | undefined) => {
    if (!val) {
      setValue(null)
      onChanged()
      return
    }
    const dt = val ?? keyboardInputValue

    setValue(dayjs(dt))

    onChanged(dayjs(dt).format())
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        key={label}
        renderInput={(props) => <TextField autoComplete={'false'} size='small' {...props} />}
        label={label}
        value={value}
        onChange={handleChange}
      />
    </LocalizationProvider>
  )
}

export default DateAndTimePicker

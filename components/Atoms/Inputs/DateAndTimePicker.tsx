import React from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { Close } from '@mui/icons-material'
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
  const [value, setValue] = React.useState<dayjs.Dayjs | undefined | null>(defaultValue !== undefined ? dayjs(defaultValue) : null)
  //const textRef = React.useRef<HTMLInputElement | null>(null)
  const handleChange = (val?: string | null, keyboardInputValue?: string | undefined) => {
    const dt = val ?? keyboardInputValue
    if (!dt) {
      //console.log('sending date: ', dt)
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
    /* if (textRef.current) {
      textRef.current.value = ''
      onChanged(undefined)
    } */
  }

  React.useEffect(() => {
    setValue(defaultValue ? dayjs(defaultValue) : null)
  }, [defaultValue])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        disabled={disabled}
        key={label}
        renderInput={(props) => (
          <TextField
            //inputRef={textRef}
            autoComplete={'off'}
            size='small'
            {...props}
            /*  InputProps={{
              endAdornment: value ? (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleClear}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ) : (
                <></>
              ),
            }} */
          />
        )}
        label={label}
        value={value ?? null}
        onChange={handleChange}
      />
    </LocalizationProvider>
  )
}

export default DateAndTimePicker

import { TextField } from '@mui/material'
import React from 'react'

const FormTextBox = ({
  defaultValue,
  label,
  required = true,
  error = false,
  onChanged,
  onBlurred,
  disabled = false,
  width = 250,
}: {
  defaultValue: string
  label: string
  required?: boolean
  error?: boolean
  onChanged: (text: string) => void
  onBlurred?: () => void
  disabled?: boolean
  width?: number | string
}) => {
  const [textError, setTextError] = React.useState(error)
  const [val, setVal] = React.useState(defaultValue)
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    if (required) {
      const isValid = val.length > 0 && !val.includes('  ')
      setTextError(!isValid)
    } else {
      setTextError(false)
    }
    onChanged(val)
  }
  return (
    <TextField
      color='secondary'
      inputProps={{ maxLength: 150 }}
      fullWidth={false}
      inputRef={textRef}
      defaultValue={val}
      size='small'
      label={label}
      placeholder={label}
      onChange={handleTextChange}
      required={required}
      error={textError}
      sx={{ color: 'secondary', width: width }}
      onBlur={onBlurred}
      disabled={disabled}
      autoComplete={'off'}
    />
  )
}

export default FormTextBox

import { TextField } from '@mui/material'
import { useRef, useState } from 'react'

const FormTextBox = ({
  defaultValue,
  label,
  required = true,
  error = false,
  onChanged,
  onBlurred,
  disabled = false,
  width = 250,
  maxLength = 2500,
  placeHolder,
}: {
  defaultValue: string
  label?: string
  required?: boolean
  error?: boolean
  onChanged?: (text: string) => void
  onBlurred?: (text: string) => void
  disabled?: boolean
  width?: number | string
  maxLength?: number
  placeHolder?: string
}) => {
  const [textError, setTextError] = useState(error)
  const [val, setVal] = useState(defaultValue)
  const textRef = useRef<HTMLInputElement | null>(null)
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    if (required) {
      const isValid = val.trim().length > 0 && !val.includes('  ')
      setTextError(!isValid)
    } else {
      setTextError(false)
    }
    onChanged?.(val)
  }
  const handleBlur = () => {
    if (textRef.current) {
      onBlurred?.(textRef.current?.value)
    }
  }
  return (
    <TextField
      slotProps={{
        htmlInput: {
          maxLength: maxLength,
        },
      }}
      fullWidth={false}
      inputRef={textRef}
      defaultValue={val}
      size='small'
      label={label}
      placeholder={placeHolder}
      onChange={handleTextChange}
      required={required}
      error={textError}
      sx={{ color: 'secondary', width: width }}
      onBlur={handleBlur}
      disabled={disabled}
      autoComplete={'off'}
    />
  )
}

export default FormTextBox

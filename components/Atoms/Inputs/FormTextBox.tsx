import { TextField } from '@mui/material'
import React from 'react'

const FormTextBox = ({ defaultValue, label, onChanged }: { defaultValue: string; label: string; onChanged: (text: string) => void }) => {
  const [textError, setTextError] = React.useState(false)
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const handleTextChange = () => {
    let isValid = textRef.current !== null && textRef.current.value.trim().length > 0
    if (!isValid) {
      setTextError(false)
      return
    } else if (textRef.current) {
      onChanged(textRef.current.value)
    }
  }
  return (
    <TextField
      color='secondary'
      inputProps={{ maxLength: 150 }}
      fullWidth={false}
      inputRef={textRef}
      defaultValue={defaultValue}
      size='small'
      label={label}
      placeholder={label}
      onChange={handleTextChange}
      required
      error={textError}
      sx={{ color: 'secondary' }}
    />
  )
}

export default FormTextBox

import { forwardRef } from 'react'
import { type FilledInputProps, type InputBaseComponentProps, type InputProps, type OutlinedInputProps, type SxProps, TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'

type DPProps = {
  id?: string
  size?: 'small' | 'medium'
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined
  inputProps?: InputBaseComponentProps | undefined
  sx?: SxProps
  fullwidth?: boolean
  onChanged: (e: string) => void
  value?: string
  label?: string
  errorMessage?: string
  placeholder?: string
}

const FormNumericTextField = forwardRef<HTMLInputElement, DPProps>(function FormNumericTextField(props: DPProps) {
  const { id, size, sx, fullwidth, onChanged, value, label, errorMessage, placeholder } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '.') {
      onChanged(e.target.value)
    }
  }

  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator
      size={size}
      id={id}
      data-testid={id}
      label={label}
      value={value}
      onChange={(e) => handleChange(e)}
      slotProps={{
        input: {
          placeholder: placeholder,
          size: 'small',
          error: !!errorMessage,
          autoCorrect: 'off',
        },
      }}
      sx={sx}
      error={!!errorMessage}
      helperText={errorMessage ?? ''}
      fullWidth={fullwidth}
      placeholder={placeholder}
    />
  )
})

export default FormNumericTextField

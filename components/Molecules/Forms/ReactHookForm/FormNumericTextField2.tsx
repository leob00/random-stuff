import { forwardRef } from 'react'
import { type FilledInputProps, type InputBaseComponentProps, type InputProps, type OutlinedInputProps, type SxProps, TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import numeral from 'numeral'

type Props = {
  id?: string
  size?: 'small' | 'medium'
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined
  inputProps?: InputBaseComponentProps | undefined
  fullwidth?: boolean
  onChanged: (e?: number) => void
  value?: number
  label?: string
  errorMessage?: string
  placeholder?: string
}

const FormNumericTextField2 = forwardRef<HTMLInputElement, Props>(function FormNumericTextField(props: Props, ref) {
  const { id, size, fullwidth, onChanged, value, label, errorMessage, placeholder } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = numeral(e.target.value)
    console.log(num.value())
    console.log(e.target.value)
    // if (e.target.value.includes('.')) {
    //   onChanged(Number(e.target.value))
    //   return
    // }
    // if (e.target.value.trim().length > 0) {
    //   onChanged(Number(e.target.value))
    // }
    onChanged(num.value() ?? undefined)
  }

  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator
      size={size}
      id={id}
      data-testid={id}
      value={value}
      onChange={(e) => handleChange(e)}
      slotProps={{
        input: {
          placeholder: placeholder,
          size: 'small',
          error: !!errorMessage,
          autoCorrect: 'off',
          label: label,
        },
      }}
      error={!!errorMessage}
      helperText={errorMessage}
      fullWidth={fullwidth}
      placeholder={placeholder}
    />
  )
})

export default FormNumericTextField2

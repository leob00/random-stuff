import { forwardRef } from 'react'
import { TextField, TextFieldProps, useTheme } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import numeral from 'numeral'

type Props = {
  id?: string
  size?: 'small' | 'medium'
  //InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined
  //inputProps?: InputBaseComponentProps | undefined
  fullwidth?: boolean
  onChanged: (e?: number) => void
  value?: number | null
  label?: string
  errorMessage?: string
  placeholder?: string
}
const CustomTextField = (props: TextFieldProps) => {
  return <TextField {...props} />
}
const FormNumericTextField2 = forwardRef<HTMLInputElement, Props>(function FormNumericTextField(props: Props, ref) {
  const { id, size, fullwidth, onChanged, value, label, errorMessage, placeholder } = props
  const theme = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = numeral(e.target.value)
    onChanged(num.value() ?? undefined)
  }

  return (
    <NumericFormat
      customInput={CustomTextField}
      thousandSeparator
      size={size ?? 'small'}
      id={id}
      data-testid={id}
      value={value}
      onChange={handleChange}
      variant='outlined'
      error={!!errorMessage}
      helperText={errorMessage}
      placeholder={placeholder}
      label={label}
      color='primary'
      slotProps={{
        htmlInput: {
          color: 'primary',
          inputMode: 'numeric',
          autoComplete: 'off',
          autoCorrect: 'off',
        },
      }}
    />
  )
})

export default FormNumericTextField2

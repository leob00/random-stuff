import { forwardRef } from 'react'
import {
  type FilledInputProps,
  type InputBaseComponentProps,
  InputLabelProps,
  type InputProps,
  type OutlinedInputProps,
  type SxProps,
  TextField,
  TextFieldProps,
  useTheme,
} from '@mui/material'
import { NumericFormat } from 'react-number-format'
import numeral from 'numeral'

type Props = {
  id?: string
  size?: 'small' | 'medium'
  //InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined
  //inputProps?: InputBaseComponentProps | undefined
  fullwidth?: boolean
  onChanged: (e?: number) => void
  value?: number
  label?: string
  errorMessage?: string
  placeholder?: string
}

const FormNumericTextField2 = forwardRef<HTMLInputElement, Props>(function FormNumericTextField(props: Props, ref) {
  const { id, size, fullwidth, onChanged, value, label, errorMessage, placeholder } = props
  const theme = useTheme()

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

  const CustomTextField = (props: TextFieldProps) => {
    return <TextField {...props} />
  }

  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator
      size={size ?? 'small'}
      id={id}
      data-testid={id}
      value={value}
      onChange={(e) => handleChange(e)}
      //color='primary'
      variant='outlined'
      error={!!errorMessage}
      helperText={errorMessage}
      fullWidth={fullwidth}
      placeholder={placeholder}
      label={label}
      color='primary'
      slotProps={{
        // htmlInput: {
        //   color: 'primary',
        // },
        input: {
          //color: 'secondary',
          autoComplete: 'off',
        },
        // inputLabel: {
        //   color: 'red',
        // },
      }}
    />
  )
})

export default FormNumericTextField2

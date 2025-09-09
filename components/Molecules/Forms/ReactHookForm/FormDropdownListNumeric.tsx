import { MenuItem, TextField } from '@mui/material'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { forwardRef } from 'react'

type Props = {
  options: DropdownItemNumeric[]
  errorMessage?: string
  value: number
  label?: string
  fullWidth?: boolean
  minWidth?: number
  onOptionSelected: (arg: number | null) => void
}

const FormDropdownListNumeric = forwardRef<HTMLInputElement, Props>(function FormDropdownListNumeric(props: Props, ref) {
  const { options, label, value, fullWidth, errorMessage, onOptionSelected, minWidth } = props

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionSelected(Number(e.target.value))
  }

  return (
    <TextField
      select
      value={value}
      size='small'
      margin='dense'
      label={label}
      fullWidth={fullWidth}
      onChange={handleSelect}
      sx={{ minWidth: minWidth }}
      error={!!errorMessage}
      helperText={errorMessage}
    >
      {options.map((item) => (
        <MenuItem key={item.value} value={`${item.value}`} selected={value === item.value} disabled={item.disabled}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
})

export default FormDropdownListNumeric

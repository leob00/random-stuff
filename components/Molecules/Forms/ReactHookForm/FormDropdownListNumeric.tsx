import { MenuItem, TextField } from '@mui/material'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { forwardRef } from 'react'

type Props = {
  options: DropdownItemNumeric[]
  errorMessage?: string
  value: number
  label?: string
  fullWidth?: boolean
  onOptionSelected: (arg: number | null) => void
}

const FormDropdownListNumeric = forwardRef<HTMLInputElement, Props>(function FormDropdownListNumeric(props: Props, ref) {
  const { options, label, value, fullWidth, errorMessage, onOptionSelected } = props

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionSelected(Number(e.target.value))
  }

  return (
    <TextField select value={value} size='small' label={label} color={'primary'} fullWidth={fullWidth} onChange={handleSelect}>
      {options.map((item) => (
        <MenuItem key={item.value} value={`${item.value}`} selected={value === item.value} color={'primary'} disabled={item.disabled}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
})

export default FormDropdownListNumeric

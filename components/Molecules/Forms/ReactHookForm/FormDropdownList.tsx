import { MenuItem, TextField } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import { forwardRef } from 'react'

type Props = {
  options: DropdownItem[]
  errorMessage?: string
  value?: string | null
  label?: string
  fullWidth?: boolean
  onOptionSelected: (arg: string | null) => void
}

const FormDropdownList = forwardRef<HTMLInputElement, Props>(function FormDropdownList(props: Props, ref) {
  const { options, label, value, fullWidth, errorMessage, onOptionSelected } = props

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionSelected?.(e.target.value)
  }

  return (
    <TextField select value={value} size='small' label={label} color={'primary'} fullWidth={fullWidth} onChange={handleSelect}>
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value} selected={value === item.value} color={'primary'} disabled={item.disabled}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
})

export default FormDropdownList

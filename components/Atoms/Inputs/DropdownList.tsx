import { MenuItem, TextField } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const DropDownList = ({
  options,
  selectedOption,
  onOptionSelected,
  label,
}: {
  options: DropdownItem[]
  selectedOption: string
  onOptionSelected?: (id: string) => void
  label?: string
}) => {
  const [opt, setOpt] = React.useState(selectedOption)
  const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpt(e.target.value)
    onOptionSelected?.(e.target.value)
  }

  return (
    <TextField select value={opt} onChange={handleOptionSelect} size='small' label={label}>
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DropDownList
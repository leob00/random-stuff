import { MenuItem, TextField, Typography } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const DropdownList = ({
  options,
  selectedOption,
  onOptionSelected,
  label,
  fullWidth,
  disabled,
}: {
  options: DropdownItem[]
  selectedOption?: string
  onOptionSelected?: (val: string) => void
  label?: string
  fullWidth?: boolean
  disabled?: boolean
}) => {
  const [opt, setOpt] = React.useState(selectedOption)
  const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpt(e.target.value)
    onOptionSelected?.(e.target.value)
  }

  return (
    <TextField select value={opt} onChange={handleOptionSelect} size='small' label={label} color={'primary'} fullWidth={fullWidth} disabled={disabled}>
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value} selected={selectedOption === opt} color={'primary'} disabled={item.disabled}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DropdownList

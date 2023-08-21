import { MenuItem, TextField } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const DropdownList = ({
  options,
  selectedOption,
  onOptionSelected,
  label,
  fullWidth,
}: {
  options: DropdownItem[]
  selectedOption: string
  onOptionSelected?: (id: string) => void
  label?: string
  fullWidth?: boolean
}) => {
  const [opt, setOpt] = React.useState(selectedOption)
  const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpt(e.target.value)
    onOptionSelected?.(e.target.value)
  }

  return (
    <TextField select value={opt} onChange={handleOptionSelect} size='small' label={label} color={'secondary'} fullWidth={fullWidth}>
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value} selected={selectedOption === opt} color={'secondary'}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DropdownList

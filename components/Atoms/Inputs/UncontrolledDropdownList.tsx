import { MenuItem, TextField, Typography } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const UncontrolledDropdownList = ({
  options,
  selectedOption,
  onOptionSelected,
  label,
  fullWidth = false,
}: {
  options: DropdownItem[]
  selectedOption: string
  onOptionSelected: (id: string) => void
  label?: string
  fullWidth?: boolean
}) => {
  const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionSelected?.(e.target.value)
  }

  return (
    <TextField select value={selectedOption} onChange={handleOptionSelect} size='small' label={label} color={'primary'} fullWidth={fullWidth}>
      {options.map((item) => (
        <MenuItem key={item.value} value={item.value} selected={item.value === selectedOption} color={'primary'}>
          <Typography color='primary'>{item.text}</Typography>
        </MenuItem>
      ))}
    </TextField>
  )
}

export default UncontrolledDropdownList

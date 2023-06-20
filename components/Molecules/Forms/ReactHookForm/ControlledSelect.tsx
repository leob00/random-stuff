import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

export const ControlledSelect = ({ fieldName, control, defaultValue, label, items }: { fieldName: string; control: Control<any, any>; defaultValue?: string; label?: string; items: DropdownItem[] }) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id='select-helper-label'>{label}</InputLabel>
            <Select labelId='select-helper-label' color='secondary' {...field} label={label} size='small'>
              {items.map((item) => (
                <MenuItem key={item.value} value={item.value} sx={{ color: CasinoBlue }}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    />
  )
}

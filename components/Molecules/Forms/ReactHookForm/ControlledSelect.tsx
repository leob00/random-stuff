import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

export const ControlledSelect = ({
  fieldName,
  control,
  defaultValue,
  label,
  items,
  disabled,
}: {
  fieldName: string
  control: Control<any, any>
  defaultValue?: string
  label?: string
  items: DropdownItem[]
  disabled?: boolean
}) => {
  const [opt, setOpt] = React.useState(defaultValue)
  const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpt(e.target.value)
  }
  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <>
          <FormControl sx={{ minWidth: 250 }}>
            {/* <InputLabel id='select-helper-label'>{label}</InputLabel> */}
            <TextField
              select
              {...field}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e.target.value)
                handleOptionSelect(e)
                //console.log('changed: ', e.target.value)
              }}
              size='small'
              label={label}
              color={'secondary'}
              disabled={disabled}
              value={opt}
            >
              {items.map((item) => (
                <MenuItem key={item.value} value={item.value} sx={{ color: CasinoBlue }} selected={item.value === opt}>
                  {item.text}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </>
      )}
    />
  )
}

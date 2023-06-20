import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Autocomplete, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'

export default function ControlledLookUpSoloInput({ control, label, options, defaultValue, fieldName, required }: { control: Control<any>; label: string; options: string[]; defaultValue: string; fieldName: string; required?: boolean }) {
  return (
    <Controller
      render={({ field }) => (
        <Autocomplete
          sx={{ width: { xs: 250, sm: 500 } }}
          freeSolo
          {...field}
          options={options}
          renderInput={(params) => (
            <TextField
              sx={{ input: { color: CasinoBlue } }}
              {...params}
              label={label}
              variant='outlined'
              size='small'
              onChange={(event) => {
                field.onChange(event.currentTarget.value)
              }}
            />
          )}
          onChange={(_, data) => {
            field.onChange(data)
          }}
        />
      )}
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required }}
    />
  )
}

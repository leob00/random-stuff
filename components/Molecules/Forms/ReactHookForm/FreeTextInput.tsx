import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'

export const FreeTextInput = ({
  name,
  control,
  defaultValue,
  placeholder = '',
  required = false,
}: {
  name: string
  control: Control<any, any>
  defaultValue: string
  placeholder?: string
  required?: boolean
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field }) => (
        <TextField
          required={required}
          placeholder={placeholder}
          autoComplete='off'
          sx={{ input: { color: CasinoBlue } }}
          size='small'
          InputProps={{
            color: 'secondary',
            autoComplete: 'off',
          }}
          {...field}
        />
      )}
      defaultValue={defaultValue}
    />
  )
}

import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'

export const ControlledFreeTextInput = ({
  fieldName,
  control,
  defaultValue,
  placeholder = '',
  label,
  required = false,
}: {
  fieldName: string
  control: Control<any, any>
  defaultValue: string
  placeholder?: string
  label: string
  required?: boolean
}) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: required }}
      render={({ field }) => (
        <TextField
          label={label}
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

import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField, useTheme } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'

export const ControlledFreeTextInput = ({
  fieldName,
  control,
  defaultValue,
  placeholder = '',
  label,
  required = false,
  type = 'text',
}: {
  fieldName: string
  control: Control<any, any>
  defaultValue: string
  placeholder?: string
  label: string
  required?: boolean
  type?: string
}) => {
  const theme = useTheme()
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: required }}
      render={({ field }) => (
        <TextField
          type={type}
          label={label}
          required={required}
          placeholder={placeholder}
          autoComplete='off'
          sx={{ input: { color: theme.palette.mode === 'light' ? CasinoBlue : 'unset' } }}
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

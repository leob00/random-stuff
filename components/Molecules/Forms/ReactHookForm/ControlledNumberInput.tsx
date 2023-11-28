import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField, useTheme } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'

export const ControlledNumberInput = ({
  fieldName,
  control,
  defaultValue,
  placeholder = '',
  label,
  required = false,
  type = 'text',
  readOnly = false,
  hidden = false,
}: {
  fieldName: string
  control: Control<any, any>
  defaultValue?: number
  placeholder?: string
  label: string
  required?: boolean
  type?: string
  readOnly?: boolean
  hidden?: boolean
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
          sx={{ input: { color: theme.palette.mode === 'light' ? CasinoBlue : 'unset' }, display: hidden ? 'none' : 'unset' }}
          size='small'
          InputProps={{
            color: 'secondary',
            autoComplete: 'off',
            readOnly: readOnly,
            type: type,
          }}
          inputProps={{ inputMode: 'numeric' }}
          {...field}
        />
      )}
      defaultValue={defaultValue}
    />
  )
}

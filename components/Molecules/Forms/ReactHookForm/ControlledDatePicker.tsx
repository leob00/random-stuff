import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

export const ControlledDatePicker = ({
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            {...field}
            renderInput={(props) => (
              <TextField
                required={required}
                placeholder={placeholder}
                size='small'
                margin='dense'
                InputProps={{
                  color: 'secondary',
                  autoComplete: 'off',
                }}
                sx={{ input: { color: CasinoBlueTransparent } }}
                {...props}
              />
            )}
            label={label}
          />
        </LocalizationProvider>
      )}
      defaultValue={defaultValue.length === 0 ? null : defaultValue}
    />
  )
}
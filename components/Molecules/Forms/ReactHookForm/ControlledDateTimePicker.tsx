import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField, useTheme } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import dayjs from 'dayjs'

export const ControlledDateTimePicker = ({
  fieldName,
  control,
  defaultValue,
  placeholder = '',
  label,
  required = false,
  minDate,
}: {
  fieldName: string
  control: Control<any, any>
  defaultValue: string | null
  placeholder?: string
  label: string
  required?: boolean
  minDate?: string
}) => {
  const theme = useTheme()
  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue ? dayjs(defaultValue) : null}
      rules={{ required: required }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            minDateTime={minDate}
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
                sx={{ input: { color: theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlueTransparent } }}
                {...props}
              />
            )}
            label={label}
          />
        </LocalizationProvider>
      )}
    />
  )
}

import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField, useTheme } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import dayjs, { Dayjs } from 'dayjs'

export const ControlledDateTimePicker = ({
  fieldName,
  control,
  value,
  placeholder = '',
  label,
  required = false,
  minDate,
  onDateChanged,
}: {
  fieldName: string
  control: Control<any, any>
  value?: string | null
  placeholder?: string
  label: string
  required?: boolean
  minDate?: string
  onDateChanged: (dt: string | null) => void
}) => {
  const handleSelect = (newDate: Dayjs | null) => {
    onDateChanged(newDate ? dayjs(newDate).format() : null)
  }
  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: required }}
      render={({ field: { value, onChange, ...field } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={value ? dayjs(value) : null}
            minDateTime={minDate ? dayjs(minDate) : undefined}
            {...field}
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            label={label}
            onChange={handleSelect}
          />
        </LocalizationProvider>
      )}
    />
  )
}

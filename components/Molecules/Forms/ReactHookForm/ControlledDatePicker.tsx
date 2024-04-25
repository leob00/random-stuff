import { Control, Controller } from 'react-hook-form'
import React from 'react'
import { TextField, useTheme } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers'

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
  defaultValue: string | null
  placeholder?: string
  label: string
  required?: boolean
}) => {
  const theme = useTheme()

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue ? dayjs(defaultValue).format('MM/DD/YYYY') : null}
      rules={{ required: required }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...field}
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            label={label}
          />
        </LocalizationProvider>
      )}
    />
  )
}

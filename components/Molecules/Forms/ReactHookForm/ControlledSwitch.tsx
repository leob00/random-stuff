import React, { ChangeEvent } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Switch } from '@mui/material'

export default function ControlledSwitch({
  control,
  defaultValue,
  fieldName,
  onChanged,
}: {
  control: Control<any>
  defaultValue: boolean
  fieldName: string
  onChanged?: (val: boolean) => void
}) {
  const handleChanged = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChanged?.(checked)
  }
  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Switch
          color={defaultValue ? 'success' : 'default'}
          {...field}
          checked={defaultValue}
          onChange={(event, checked) => {
            field.onChange(checked)
            handleChanged(event, checked)
          }}
        />
      )}
    />
  )
}

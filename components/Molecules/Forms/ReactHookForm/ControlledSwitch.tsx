import React, { ChangeEvent } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Switch } from '@mui/material'

export default function ControlledSwitch({
  control,
  label,
  defaultValue,
  fieldName,
  onChanged,
}: {
  control: Control<any>
  label: string
  defaultValue: boolean
  fieldName: string
  onChanged?: (val: boolean) => void
}) {
  //const [checked, setChecked] = React.useState(defaultValue)
  const handleChanged = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChanged?.(checked)
  }
  //console.log('switch: ', defaultValue)

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Switch
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

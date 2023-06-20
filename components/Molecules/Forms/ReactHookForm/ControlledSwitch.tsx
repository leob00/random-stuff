import React from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Switch } from '@mui/material'

export default function ControlledSwitch({ control, label, defaultValue, fieldName }: { control: Control<any>; label: string; defaultValue: boolean; fieldName: string }) {
  //const [checked, setChecked] = React.useState(defaultValue)

  return <Controller name={fieldName} control={control} render={({ field }) => <Switch {...field} defaultChecked={defaultValue} />} />
}

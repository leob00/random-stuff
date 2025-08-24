import React, { ChangeEvent } from 'react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Box, Switch, Typography } from '@mui/material'

export default function ControlledSwitch({
  control,
  defaultValue,
  fieldName,
  onChanged,
  label,
}: {
  control: Control<any>
  defaultValue: boolean
  fieldName: string
  onChanged?: (val: boolean) => void
  label?: string
}) {
  const handleChanged = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChanged?.(checked)
  }
  return (
    <Box display={'flex'} gap={2} alignItems={'center'}>
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
      {label && <Typography>{label}</Typography>}
    </Box>
  )
}

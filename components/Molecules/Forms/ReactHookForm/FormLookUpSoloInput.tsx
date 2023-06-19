import React, { ChangeEventHandler } from 'react'
import _ from 'lodash/fp'
import { Controller, FieldValues } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { GroupInputs } from '../EditStockGroupForm'
import { Autocomplete, TextField } from '@mui/material'

export default function FormLookUpSoloInput({
  control,
  label,
  options,
  defaultValue,
  fieldName,
  required,
}: {
  control: Control<any>
  label: string
  options: string[]
  defaultValue: string
  fieldName: string
  required?: boolean
}) {
  return (
    <Controller
      render={({ field }) => (
        <Autocomplete
          //value={val}
          freeSolo
          {...field}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant='outlined'
              size='small'
              onChange={(event) => {
                field.onChange(event.currentTarget.value)
              }}
            />
          )}
          onChange={(_, data) => {
            field.onChange(data)
          }}
        />
      )}
      name={fieldName}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required }}
    />
  )
}

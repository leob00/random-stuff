import React, { ChangeEventHandler } from 'react'
import _ from 'lodash/fp'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { GroupInputs } from '../EditStockGroupForm'
import { Autocomplete, TextField } from '@mui/material'

export default function FormLookUpSoloInput({
  control,
  options,
  defaultValue,
  fieldName,
  required,
}: {
  control: Control<GroupInputs>
  options: string[]
  defaultValue: string
  fieldName: keyof GroupInputs
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
              label='Choose a group'
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

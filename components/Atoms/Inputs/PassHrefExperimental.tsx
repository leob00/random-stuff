import { Autocomplete, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { forwardRef } from 'react'
import { AutoCompleteProps } from './AutoCompleteSolo'

export type InputTextRef = HTMLInputElement

export const PassHrefExperimental = forwardRef<InputTextRef, AutoCompleteProps>((props, ref) => (
  <Autocomplete
    value={props.defaultValue}
    size='small'
    id='searchAutoComplete'
    freeSolo
    sx={{ width: props.width, input: { color: CasinoBlue } }}
    options={props.options}
    onChange={(e, value) => {
      props.onSubmitted(value ?? '')
    }}
    autoHighlight
    renderInput={(params) => (
      <TextField
        {...params}
        label={props.label}
        sx={{ input: { color: CasinoBlue } }}
        inputRef={ref}
        placeholder={''}
        inputProps={{
          ...params.inputProps,
          color: 'secondary',
          autoComplete: 'off', // disable autocomplete and autofill
        }}
        onChange={() => {}}
      />
    )}
  />
))
PassHrefExperimental.displayName = 'PassHrefExperimental'

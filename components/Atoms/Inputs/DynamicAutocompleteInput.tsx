import { Autocomplete, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { forwardRef } from 'react'

interface Props {
  defaultValue: string
  options: DropdownItem[]
  label: string
  width: number | string
  onSelected: (text: string | null) => void
}
export type InputTextRef = HTMLInputElement

export const DynamicAutoCompleteInput = forwardRef<InputTextRef, Props>((props, ref) => (
  <Autocomplete
    value={props.defaultValue}
    size='small'
    id='searchAutoComplete'
    freeSolo
    sx={{ width: props.width, input: { color: CasinoBlue } }}
    options={props.options}
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
DynamicAutoCompleteInput.displayName = 'DynamicAutoCompleteInput'

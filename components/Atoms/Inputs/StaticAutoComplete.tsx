import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { Option } from 'lib/AutoCompleteOptions'
import { DropdownItem } from 'lib/models/dropdown'

const StaticAutoComplete = ({
  options,
  placeholder = 'search',
  onSelected,
  selectedItem,
  disableClearable = false,
  fullWidth,
  onChanged,
  errorMessage,
}: {
  options: DropdownItem[]
  placeholder?: string
  onSelected: (item: DropdownItem) => void
  selectedItem?: DropdownItem
  disableClearable?: boolean
  fullWidth?: boolean
  onChanged?: (text: string) => void
  errorMessage?: string
}) => {
  const items: Option[] = options.map((m) => {
    return {
      id: m.value,
      label: m.text,
    }
  })

  const selectedOption: Option | undefined = selectedItem ? { id: selectedItem.value, label: selectedItem.text } : undefined
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const handleSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: Option | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Option> | undefined,
  ) => {
    const selectedItem = { ...value }
    const item: DropdownItem = {
      value: selectedItem.id!,
      text: selectedItem.label!,
    }
    if (inputRef.current) {
      inputRef.current.blur()
    }
    onSelected(item)
  }

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChanged?.(event.target.value)
  }

  return (
    <Autocomplete
      value={selectedOption}
      size='small'
      onChange={handleSelect}
      disablePortal
      options={items}
      sx={!fullWidth ? { width: { xs: 260, md: 600 } } : {}}
      disableClearable={disableClearable}
      isOptionEqualToValue={(opt, compOpt) => opt.id === compOpt.id}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          inputRef={inputRef}
          {...params}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            color: 'secondary',
            autoComplete: 'off',
          }}
          onChange={handleTextChange}
          error={!!errorMessage}
          helperText={errorMessage ?? undefined}
        />
      )}
    />
  )
}

export default StaticAutoComplete

import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, TextField } from '@mui/material'
import React from 'react'
import { Option } from 'lib/AutoCompleteOptions'
import { DropdownItem } from 'lib/models/dropdown'

const StaticAutoComplete = ({
  options,
  placeholder = 'search',
  onSelected,
  selectedItem,
  disableClearable = false,
  fullWidth,
}: {
  options: DropdownItem[]
  placeholder?: string
  onSelected: (item: DropdownItem) => void
  selectedItem?: DropdownItem
  disableClearable?: boolean
  fullWidth?: boolean
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
  return (
    <Autocomplete
      value={selectedOption}
      size='small'
      onChange={handleSelect}
      disablePortal
      options={items}
      sx={{ width: { xs: 200, md: 400 } }}
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
        />
      )}
    />
  )
}

export default StaticAutoComplete

import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import React from 'react'
import { Option } from 'lib/AutoCompleteOptions'
import { DropdownItem } from 'lib/models/dropdown'

const StaticAutoComplete = ({
  options,
  placeholder = 'search',
  onSelected,
}: {
  options: DropdownItem[]
  placeholder?: string

  onSelected: (item: DropdownItem) => void
}) => {
  const items: Option[] = options.map((m) => {
    return {
      id: m.value,
      label: m.text,
    }
  })
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
    onSelected(item)
  }
  return (
    <Autocomplete
      size='small'
      onChange={handleSelect}
      disablePortal
      options={items}
      sx={{ width: 360 }}
      isOptionEqualToValue={(opt, compOpt) => opt.id === compOpt.id}
      renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
    />
  )
}

export default StaticAutoComplete

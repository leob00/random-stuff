'use client'
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, TextField, useTheme } from '@mui/material'
import { ChangeEvent, useRef } from 'react'
import { Option } from 'lib/AutoCompleteOptions'
import { DropdownItem } from 'lib/models/dropdown'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

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
  const theme = useTheme()
  const items: Option[] = options.map((m) => {
    return {
      id: m.value,
      label: m.text,
    }
  })

  const selectedOption: Option | undefined = selectedItem ? { id: selectedItem.value, label: selectedItem.text } : undefined
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSelect = (value: Option | null) => {
    if (value) {
      const selectedItem = { ...value }
      const item: DropdownItem = {
        value: selectedItem.id!,
        text: selectedItem.label!,
      }
      if (inputRef.current) {
        inputRef.current.blur()
      }
      if (!disableClearable) {
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      }
      onSelected(item)
    }
  }

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChanged?.(event.target.value)
  }

  return (
    <>
      <Autocomplete
        value={selectedOption}
        size='small'
        onChange={(e, opt) => {
          handleSelect(opt)
        }}
        disablePortal
        options={items}
        sx={{
          '& .MuiInputBase-root': {
            color: theme.palette.info.main,
          },
          ...(!fullWidth ? { width: { xs: 260, md: 600 } } : {}),
        }}
        slotProps={{
          listbox: {
            sx: {
              '& .MuiAutocomplete-option': {
                color: theme.palette.info.main,
              },
            },
          },
        }}
        disableClearable={disableClearable}
        isOptionEqualToValue={(opt, compOpt) => opt.id === compOpt.id}
        fullWidth={fullWidth}
        renderInput={(params) => (
          <TextField
            inputRef={inputRef}
            {...params}
            placeholder={placeholder}
            onChange={handleTextChange}
            error={!!errorMessage}
            helperText={errorMessage ?? undefined}
            sx={{
              '& .MuiInputBase-input': {
                color: theme.palette.info.main,
              },
              fieldset: {
                borderColor: CasinoBlueTransparent, // Default border color
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          />
        )}
      />
    </>
  )
}

export default StaticAutoComplete

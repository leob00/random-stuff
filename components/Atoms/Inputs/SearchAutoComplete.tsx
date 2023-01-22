import { Close } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton, MenuItem, Autocomplete, Box } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce, size } from 'lodash'
import React from 'react'

const SearchAutoComplete = ({
  onChanged,
  width = 600,
  placeholder = 'search in results',
  debounceWaitMilliseconds = 500,
  searchResults,
  onSelected,
  clearOnSelect = true,
}: {
  onChanged?: (text: string) => void
  width?: number
  placeholder?: string
  debounceWaitMilliseconds?: number
  searchResults: DropdownItem[]
  onSelected: (text: string) => void
  clearOnSelect?: boolean
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const [defaultValue, setDefaultValue] = React.useState('')

  //console.log('search results: ', searchResults.length)

  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFn(e.currentTarget.value)
    setDefaultValue(e.currentTarget.value)
  }
  const handleSelected = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    if (value) {
      onSelected(value)
    }
    if (clearOnSelect) {
      if (textRef.current) {
        textRef.current.blur()
      }
      setDefaultValue('')
    }
  }

  return (
    <Autocomplete
      value={defaultValue}
      size='small'
      id='searchAutoComplete'
      freeSolo
      sx={{ width: width }}
      options={searchResults.map((e) => e.text)}
      autoHighlight
      onChange={(e, value) => {
        handleSelected(e, value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          inputRef={textRef}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          onChange={handleChange}
        />
      )}
    />
  )
}

export default SearchAutoComplete

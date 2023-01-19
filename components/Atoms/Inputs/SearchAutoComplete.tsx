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
}: {
  onChanged?: (text: string) => void
  width?: number
  placeholder?: string
  debounceWaitMilliseconds?: number
  searchResults: DropdownItem[]
  onSelected: (text: string) => void
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)

  //console.log('search results: ', searchResults.length)

  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFn(e.currentTarget.value)
  }
  const handleSelected = (value: string | null) => {
    if (value) {
      onSelected(value)
    }
  }

  const handleClear = () => {
    if (textRef.current) {
      textRef.current.value = ''
      onChanged?.('')
    }
  }
  return (
    <Autocomplete
      size='small'
      id='searchAutoComplete'
      freeSolo
      sx={{ width: width }}
      options={searchResults.map((e) => e.text)}
      autoHighlight
      onChange={(e, value) => {
        handleSelected(value)
      }}
      //getOptionLabel={(option) => option.text}
      /*  renderOption={(props, option) => (
        <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {option.text}
        </Box>
      )} */
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
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

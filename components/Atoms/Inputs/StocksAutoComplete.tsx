import { TextField, Autocomplete } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce } from 'lodash'
import React from 'react'

const StocksAutoComplete = ({
  onChanged,
  width = 600,
  placeholder = 'search in results',
  debounceWaitMilliseconds = 250,
  searchResults,
  onSelected,
  clearOnSelect = true,
  label = '',
  defaultVal = '',
}: {
  onChanged?: (text: string) => void
  width?: number
  placeholder?: string
  debounceWaitMilliseconds?: number
  searchResults: DropdownItem[]
  onSelected: (text: string) => void
  clearOnSelect?: boolean
  label?: string
  defaultVal?: string | null
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const [defaultValue, setDefaultValue] = React.useState(defaultVal)

  //console.log('search results: ', searchResults.length)

  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultValue(e.currentTarget.value)
    debouncedFn(e.currentTarget.value)
  }
  const handleSelected = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    if (value) {
      onSelected(value)
    }
    if (clearOnSelect) {
      if (textRef.current) {
        textRef.current.blur()
      }
    }
  }

  return (
    <Autocomplete
      value={defaultValue}
      size='small'
      id='searchAutoComplete'
      freeSolo
      sx={{ width: width, input: { color: CasinoBlue } }}
      options={searchResults.map((e) => e.text)}
      autoHighlight
      onChange={(e, value) => {
        handleSelected(e, value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ input: { color: CasinoBlue } }}
          inputRef={textRef}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            color: 'secondary',
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          onChange={handleChange}
        />
      )}
    />
  )
}

export default StocksAutoComplete

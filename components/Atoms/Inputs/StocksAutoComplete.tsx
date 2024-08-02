import { TextField, Autocomplete } from '@mui/material'
import { CasinoBlue, VeryLightBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce } from 'lodash'
import React from 'react'
import { useTheme } from '@mui/material'

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
  errorMessage,
  freesolo = true,
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
  errorMessage?: string
  freesolo?: boolean
}) => {
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlue
  const textRef = React.useRef<HTMLInputElement | null>(null)

  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFn(e.currentTarget.value)
  }
  const handleSelected = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    if (value) {
      onSelected(value)
      if (clearOnSelect) {
        if (textRef.current) {
          textRef.current.value = ''
          textRef.current.blur()
        }
      }
    } else {
      onSelected('')
    }
  }

  return (
    <Autocomplete
      autoCorrect={'false'}
      autoComplete={false}
      value={defaultVal}
      size='small'
      id='searchAutoComplete'
      freeSolo={freesolo}
      sx={{ width: width, input: { color: color } }}
      options={searchResults.map((e) => e.text)}
      autoHighlight
      onChange={(e, value) => {
        handleSelected(e, value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ input: { color: color } }}
          inputRef={textRef}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            color: 'secondary',
            autoComplete: 'off',
          }}
          onChange={handleChange}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      )}
    />
  )
}

export default StocksAutoComplete

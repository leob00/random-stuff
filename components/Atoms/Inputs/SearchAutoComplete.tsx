import { TextField, Autocomplete, AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce } from 'lodash'
import { useRef } from 'react'
import { Option } from 'lib/AutoCompleteOptions'
import CircularProgress from '@mui/material/CircularProgress'

const SearchAutoComplete = ({
  onChanged,
  placeholder = 'search in results',
  debounceWaitMilliseconds = 500,
  searchResults,
  onSelected,
  isLoading,
}: {
  onChanged?: (text: string) => void
  placeholder?: string
  debounceWaitMilliseconds?: number
  searchResults: DropdownItem[]
  onSelected: (item: DropdownItem) => void
  label?: string
  defaultVal?: string | null
  isLoading?: boolean
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const options: Option[] = searchResults.map((m) => {
    return { id: m.value, label: m.text }
  })
  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFn(e.currentTarget.value)
  }

  const handleSelected = (
    _event: React.SyntheticEvent<Element, Event>,
    value: Option | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<Option> | undefined,
  ) => {
    if (value) {
      onSelected({ value: value.id, text: value.label })
    }
  }

  return (
    <Autocomplete
      loading={isLoading}
      noOptionsText={''}
      size='small'
      onChange={handleSelected}
      disablePortal
      options={options}
      sx={{ width: { xs: 260, md: 600 } }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          onChange={handleChange}
          inputRef={inputRef}
          {...params}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            color: 'primary',
            autoComplete: 'off',
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchAutoComplete

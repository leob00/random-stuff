import { TextField, Autocomplete } from '@mui/material'
import { CasinoBlue, VeryLightBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce, take } from 'lodash'
import { useTheme } from '@mui/material'
import { useRef, useState } from 'react'

const StaticAutoCompleteFreeSolo = ({
  placeholder = 'search in results',
  debounceWaitMilliseconds = 450,
  searchResults,
  onSelected,
  clearOnSelect = true,
  label = '',
  errorMessage,
}: {
  width?: number
  placeholder?: string
  debounceWaitMilliseconds?: number
  searchResults: DropdownItem[]
  onSelected: (item: DropdownItem) => void
  clearOnSelect?: boolean
  label?: string
  errorMessage?: string
}) => {
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlue
  const textRef = useRef<HTMLInputElement | null>(null)
  const [selectedVal, setSelectedVal] = useState('')
  const [filtered, setFiltered] = useState<DropdownItem[]>([])

  const handleSearched = (text: string) => {
    const found = take(
      searchResults.filter((m) => m.text.toLowerCase().includes(text.toLowerCase())),
      10,
    )
    setFiltered(found)
    // console.log('found: ', found.length)
  }

  const raiseChangeEvent = (term: string) => {
    handleSearched(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedVal(e.currentTarget.value)
    debouncedFn(e.currentTarget.value)
  }
  const handleSelected = (value: string | null) => {
    if (value) {
      if (clearOnSelect) {
        if (textRef.current) {
          textRef.current.value = ''
          textRef.current.blur()
          setSelectedVal('')
        }
      }
      const item = filtered.find((m) => m.text.toLowerCase() === value.toLowerCase())
      if (item) {
        onSelected(item)
      }
    }
  }
  const options = filtered.map((e) => e.text)

  return (
    <Autocomplete
      value={selectedVal}
      autoCorrect={'false'}
      autoComplete={false}
      size='small'
      id='searchAutoComplete'
      freeSolo
      sx={{ width: { xs: 300, sm: 600 }, input: { color: color } }}
      options={options}
      autoHighlight
      onChange={(_, value) => {
        handleSelected(value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ input: { color: color } }}
          inputRef={textRef}
          placeholder={placeholder}
          onChange={handleChange}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      )}
    />
  )
}

export default StaticAutoCompleteFreeSolo

import { TextField, Autocomplete } from '@mui/material'
import { CasinoBlue, CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import { debounce } from 'lodash'
import { useTheme } from '@mui/material'
import { useRef, useState } from 'react'

const StocksAutoComplete = ({
  onChanged,
  width = 600,
  placeholder = 'search in results',
  debounceWaitMilliseconds = 250,
  searchResults,
  onSelected,
  clearOnSelect = true,
  label = '',
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
  errorMessage?: string
  freesolo?: boolean
}) => {
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlue
  const textRef = useRef<HTMLInputElement | null>(null)
  const [selectedVal, setSelectedVal] = useState('')

  const raiseChangeEvent = (term: string) => {
    onChanged?.(term)
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
      onSelected(value)
    } else {
      onSelected('')
    }
  }
  const options = searchResults.map((e) => e.text)

  return (
    <Autocomplete
      value={selectedVal}
      autoCorrect={'false'}
      autoComplete={false}
      size='small'
      id='searchAutoComplete'
      freeSolo={freesolo}
      sx={{ width: width }}
      options={options}
      autoHighlight
      onChange={(_, value) => {
        handleSelected(value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            fieldset: {
              borderColor: CasinoBlueTransparent, // Default border color
            },
          }}
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

export default StocksAutoComplete

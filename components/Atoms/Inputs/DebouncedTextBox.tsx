import Close from '@mui/icons-material/Close'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { debounce } from 'lodash'
import React from 'react'

const DebouncedTextBox = ({
  onChanged,
  width = 220,
  disabled = false,
  placeholder = '',
  defaultValue = '',
  debounceWaitMilliseconds = 250,
}: {
  onChanged?: (text: string) => void
  width?: number
  disabled?: boolean
  placeholder?: string
  defaultValue?: string
  debounceWaitMilliseconds?: number
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)

  const [search, setSearch] = React.useState(defaultValue ?? '')

  const raiseChangeEvent = (term: string) => {
    setSearch(term)
    onChanged?.(term)
  }
  const debouncedFn = debounce(raiseChangeEvent, debounceWaitMilliseconds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFn(e.currentTarget.value)
  }

  const handleClear = () => {
    setSearch('')
    if (textRef.current) {
      textRef.current.value = ''
      onChanged?.('')
    }
  }
  return (
    <TextField
      defaultValue={defaultValue}
      disabled={disabled}
      sx={{ width: width }}
      onChange={handleChange}
      size='small'
      placeholder={placeholder}
      inputRef={textRef}
      InputProps={{
        endAdornment:
          search.length > 0 ? (
            <InputAdornment position='end'>
              <IconButton edge='end' onClick={handleClear}>
                <Close />
              </IconButton>
            </InputAdornment>
          ) : (
            <></>
          ),
      }}
    ></TextField>
  )
}

export default DebouncedTextBox

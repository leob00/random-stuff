import { Close } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import { debounce } from 'lodash'
import React from 'react'

const SearchWithinList = ({
  onChanged,
  width = 220,
  disabled = false,
  text = 'search in results',
  defaultValue = '',
  debounceWaitMilliseconds = 250,
}: {
  onChanged?: (text: string) => void
  width?: number
  disabled?: boolean
  text?: string
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
      autoComplete='off'
      defaultValue={defaultValue}
      disabled={disabled}
      id='searchWithinList'
      sx={{ width: width, input: { color: CasinoBlue } }}
      onChange={handleChange}
      size='small'
      placeholder={text}
      inputRef={textRef}
      InputProps={{
        color: 'secondary',
        autoComplete: 'off',
        endAdornment:
          search.length > 0 ? (
            <InputAdornment position='end'>
              <IconButton edge='end' onClick={handleClear} color={'secondary'}>
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

export default SearchWithinList

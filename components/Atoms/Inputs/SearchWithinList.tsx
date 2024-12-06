import Close from '@mui/icons-material/Close'
import { TextField, InputAdornment, IconButton, useTheme } from '@mui/material'
import { CasinoBlue, VeryLightBlue } from 'components/themes/mainTheme'
import { debounce } from 'lodash'
import React from 'react'

const SearchWithinList = ({
  onChanged,
  width = 220,
  disabled = false,
  text = 'search in results ',
  defaultValue = '',
  debounceWaitMilliseconds = 250,
  fullWidth = false,
}: {
  onChanged?: (text: string) => void
  width?: number
  disabled?: boolean
  text?: string
  defaultValue?: string
  debounceWaitMilliseconds?: number
  fullWidth?: boolean
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)
  const theme = useTheme()

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
      margin='dense'
      autoComplete='off'
      defaultValue={defaultValue}
      disabled={disabled}
      id='searchWithinList'
      sx={{ width: !fullWidth ? width : undefined, input: { color: theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlue } }}
      onChange={handleChange}
      size='small'
      placeholder={text}
      inputRef={textRef}
      slotProps={{
        input: {
          spellCheck: false,
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
        },
      }}
      fullWidth={fullWidth}
    ></TextField>
  )
}

export default SearchWithinList

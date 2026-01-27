import Close from '@mui/icons-material/Close'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
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
      sx={{
        width: !fullWidth ? width : undefined,
        fieldset: {
          borderColor: CasinoBlueTransparent, // Default border color
        },
      }}
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
                <IconButton size='small' edge='end' onClick={handleClear} color={'secondary'}>
                  <Close fontSize='small' color='primary' />
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

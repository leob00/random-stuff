import { Close } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import React from 'react'

const SearchWithinList = ({
  onChanged,
  width = 220,
  disabled = false,
  text = 'search in results',
}: {
  onChanged?: (text: string) => void
  width?: number
  disabled?: boolean
  text?: string
}) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)

  const [search, setSearch] = React.useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    onChanged?.(e.currentTarget.value)
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
      disabled={disabled}
      id='searchWithinList'
      sx={{ width: width }}
      onChange={handleChange}
      size='small'
      placeholder={text}
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

export default SearchWithinList

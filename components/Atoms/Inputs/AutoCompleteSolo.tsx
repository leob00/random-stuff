import { Autocomplete, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import React from 'react'
export interface AutoCompleteProps {
  defaultValue: string | null
  options: string[]
  label: string
  width: number | string
  onSubmitted: (text: string) => void
}
const AutoCompleteSolo = ({ props }: { props: AutoCompleteProps }) => {
  const textRef = React.useRef<HTMLInputElement | null>(null)

  const handleBlur = () => {
    if (textRef.current) {
      props.onSubmitted(textRef.current.value)
    }
  }
  const handleSubmitted = (text: string | null) => {
    if (text) {
      props.onSubmitted(text)
    }
  }

  return (
    <Autocomplete
      value={props.defaultValue}
      size='small'
      id='searchAutoComplete'
      freeSolo
      sx={{ width: props.width }}
      options={props.options}
      onChange={(e, value) => {
        handleSubmitted(value)
      }}
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          sx={{ input: { color: CasinoBlue } }}
          inputRef={textRef}
          placeholder={''}
          inputProps={{
            ...params.inputProps,
            color: 'secondary',
            autoComplete: 'off', // disable autocomplete and autofill
          }}
          onBlur={handleBlur}
        />
      )}
    />
  )
}

export default AutoCompleteSolo

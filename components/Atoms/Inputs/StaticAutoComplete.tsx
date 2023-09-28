import { Autocomplete, TextField } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import React from 'react'

const StaticAutoComplete = ({
  options,
  placeholder = 'search',
  onSelected,
}: {
  options: string[]
  placeholder?: string

  onSelected: (data: string) => void
}) => {
  return (
    <Autocomplete
      fullWidth
      freeSolo
      sx={{ width: { xs: 250, md: 500 }, input: { color: CasinoBlue } }}
      options={options}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} variant='outlined' size='small' sx={{ width: '100%', maxWidth: '708px', borderRadius: 1 }} />
      )}
      onChange={(_, data) => {
        if (data) {
          onSelected(data)
        }
      }}
    />
  )
}

export default StaticAutoComplete

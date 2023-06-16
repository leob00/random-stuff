import { TextField, TextFieldProps } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import React from 'react'

const SmallTextBox: React.FC<TextFieldProps> = ({ ...props }) => {
  return (
    <TextField
      {...props}
      autoComplete='off'
      //   defaultValue={defaultValue}
      //   id='searchWithinList'
      //   sx={{ input: { color: CasinoBlue } }}
      size='small'
      //   placeholder={placeholder}
      //   InputProps={{
      //     color: 'secondary',
      //     autoComplete: 'off',
      //   }}
    />
  )
}

export default SmallTextBox

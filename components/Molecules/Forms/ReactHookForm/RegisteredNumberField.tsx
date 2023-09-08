import { TextField, useTheme } from '@mui/material'
import { CasinoBlue } from 'components/themes/mainTheme'
import React from 'react'

const RegisteredNumberField = ({ placeholder }: { placeholder: string }) => {
  const theme = useTheme()
  return (
    <TextField
      type={'number'}
      label={''}
      placeholder={placeholder}
      autoComplete='off'
      sx={{ input: { color: theme.palette.mode === 'light' ? CasinoBlue : 'unset' } }}
      size='small'
      InputProps={{
        color: 'secondary',
        autoComplete: 'off',
      }}
    />
  )
}

export default RegisteredNumberField

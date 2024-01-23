import { Alert, AlertTitle, useTheme } from '@mui/material'
import { CasinoOrange } from 'components/themes/mainTheme'
import React from 'react'

const AlertWithHeader = ({ header, text, severity }: { header: string; text: string; severity: 'warning' | 'info' | 'success' | 'error' }) => {
  const theme = useTheme()
  return (
    <Alert severity={severity}>
      <AlertTitle color={theme.palette.warning.light}>{header}</AlertTitle>
      {text}
    </Alert>
  )
}

export default AlertWithHeader

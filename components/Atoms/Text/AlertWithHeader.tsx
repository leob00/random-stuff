import { Alert, AlertTitle, useTheme } from '@mui/material'
import { CasinoOrange } from 'components/themes/mainTheme'
import React from 'react'

const AlertWithHeader = ({ header, text, severity }: { header?: string; text: string; severity: 'warning' | 'info' | 'success' | 'error' }) => {
  const theme = useTheme()
  let color = theme.palette.primary.dark
  switch (severity) {
    case 'info':
      color = theme.palette.mode === 'dark' ? theme.palette.info.dark : theme.palette.info.light
      break
    case 'warning':
      color = theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.light
      break
    case 'success':
      color = theme.palette.success.light
      break
    case 'error':
      color = theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light
      break
  }
  return (
    <Alert severity={severity}>
      {header && <AlertTitle color={color}>{header}</AlertTitle>}
      {text}
    </Alert>
  )
}

export default AlertWithHeader

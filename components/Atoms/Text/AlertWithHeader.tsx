import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

const AlertWithHeader = ({ header, text, severity }: { header: string; text: string; severity: 'warning' | 'info' | 'success' | 'error' }) => {
  return (
    <Alert severity={severity}>
      <AlertTitle>{header}</AlertTitle>
      {text}
    </Alert>
  )
}

export default AlertWithHeader

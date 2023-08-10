import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import darkTheme from './darkTheme'
import { CssBaseline } from '@mui/material'

export function DarkMode({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}

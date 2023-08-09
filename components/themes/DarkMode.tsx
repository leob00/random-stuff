import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import darkTheme from './darkTheme'

export function DarkMode({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}

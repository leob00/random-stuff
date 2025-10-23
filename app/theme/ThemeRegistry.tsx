'use client'
import { Theme, ThemeProvider, ThemeProviderProps } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import darkTheme from 'components/themes/darkTheme'
import lightThme from 'components/themes/mainTheme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : lightThme
}

export default function ThemeRegistry({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <>{children}</>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

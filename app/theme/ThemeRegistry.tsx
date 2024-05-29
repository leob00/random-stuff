'use client'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { NextAppDirEmotionCacheProvider } from './EmotionCache'
import darkTheme from 'components/themes/darkTheme'
import lightThme from 'components/themes/mainTheme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : lightThme
}

export default function ThemeRegistry({ colorMode, children }: { colorMode: 'light' | 'dark'; children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={getTheme(colorMode)}>
        <CssBaseline />
        <>{children}</>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

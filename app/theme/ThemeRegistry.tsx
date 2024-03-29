'use client'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { NextAppDirEmotionCacheProvider } from './EmotionCache'
import darkTheme from 'components/themes/darkTheme'

const themeOptions: ThemeOptions = {}

//const theme = createTheme(themeOptions)

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <>{children}</>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  )
}

'use client'
import '../../styles/globals.css'
import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import { ReactNode, useEffect, useState } from 'react'
import darkTheme from './darkTheme'
import mainTheme from './mainTheme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : mainTheme
}

const StyledRoot = ({ children }: { children: ReactNode }) => {
  const { palette, savePalette } = useSessionSettings()
  const [isLoading, setIsLoading] = useState(true)
  const handleChangeColorMode = () => {
    const newMode = palette === 'light' ? 'dark' : 'light'
    savePalette(newMode)
    setTheme(getTheme(newMode))
  }

  const [theme, setTheme] = useState(getTheme(palette))

  useEffect(() => {
    if (isLoading) {
      savePalette(palette)
      setTheme(getTheme(palette))
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette])

  return (
    <>
      {!isLoading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header onSetColorMode={handleChangeColorMode} colorTheme={palette} />
          <AppRouteTracker>
            <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4, maxWidth: { xl: 1600, lg: 1400 } }}>{children}</Container>
          </AppRouteTracker>
          <Footer />
        </ThemeProvider>
      )}
    </>
  )
}

export default StyledRoot

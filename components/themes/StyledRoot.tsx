'use client'
import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import { ReactNode, useEffect, useState } from 'react'
import darkTheme from './darkTheme'
import mainTheme from './mainTheme'

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
  }, [palette])

  return (
    <>
      {!isLoading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header onSetColorMode={handleChangeColorMode} colorTheme={palette} />
          <AppRouteTracker>
            <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4 }}>{children}</Container>
          </AppRouteTracker>
          <Footer />
        </ThemeProvider>
      )}
    </>
  )
}

export default StyledRoot

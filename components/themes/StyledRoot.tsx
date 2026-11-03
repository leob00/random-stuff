'use client'
import '../../styles/globals.css'
import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import darkTheme from './darkTheme'
import mainTheme from './mainTheme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import HideOnScroll from './HideOnScroll'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import Header from 'components/Header'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import Footer from 'components/Footer'

const StyledRoot = ({ children }: { children: ReactNode }) => {
  const { paletteMode, savePaletteMode } = useLocalStore()
  const [isLoading, setIsLoading] = useState(true)

  const theme = useMemo(() => {
    return paletteMode === 'dark' ? darkTheme : mainTheme
  }, [paletteMode])

  const handleChangeColorMode = () => {
    const newMode = paletteMode === 'light' ? 'dark' : 'light'
    savePaletteMode(newMode)
  }

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteMode])

  return (
    <>
      {!isLoading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header onSetColorMode={handleChangeColorMode} colorTheme={paletteMode} />
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

'use client'
import { CssBaseline, ThemeProvider, Container } from '@mui/material'
import { getTheme } from 'app/theme/ThemeRegistry'
import Footer from 'components/Footer'
import Header from 'components/Header'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import { ReactNode } from 'react'

const StyledRoot = ({ children }: { children: ReactNode }) => {
  const { palette, savePalette } = useSessionSettings()
  const handleChangeColorMode = () => {
    const newMode = palette === 'light' ? 'dark' : 'light'
    savePalette(newMode)
  }
  return (
    <ThemeProvider theme={getTheme(palette)}>
      <CssBaseline />
      <Header onSetColorMode={handleChangeColorMode} colorTheme={palette} />
      <AppRouteTracker>
        <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4 }}>{children}</Container>
      </AppRouteTracker>
      <Footer />
    </ThemeProvider>
  )
}

export default StyledRoot

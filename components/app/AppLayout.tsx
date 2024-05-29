'use client'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import React, { ReactNode, Suspense } from 'react'
//import '../../styles/globals.css'
import Footer from 'components/Footer'
import AppHeader from './AppHeader'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { Analytics } from '@vercel/analytics/react'

const AppLayout = ({
  children,
  colorMode,
  onChangeTheme,
}: {
  children: ReactNode
  colorMode: 'light' | 'dark'
  onChangeTheme: (colorMode: 'light' | 'dark') => void
}) => {
  const handleChangePalette = (palette: 'light' | 'dark') => {
    onChangeTheme(palette)
  }

  return (
    <>
      <Analytics />
      <AppRouteTracker />
      <AppHeader onSetColorMode={handleChangePalette} colorTheme={colorMode} />
      <ResponsiveContainer>
        <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4 }}>{children}</Container>
      </ResponsiveContainer>
      <Footer />
    </>
  )
}

export default AppLayout

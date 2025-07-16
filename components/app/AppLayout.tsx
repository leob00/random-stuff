'use client'
import { Container } from '@mui/material'
import { ReactNode } from 'react'
//import '../../styles/globals.css'
import Footer from 'components/Footer'
import AppHeader from './AppHeader'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

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

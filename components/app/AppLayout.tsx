'use client'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import React, { ReactNode, useEffect } from 'react'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
import '../../styles/globals.css'
import Footer from 'components/Footer'
import { Analytics } from '@vercel/analytics/react'
import AppHeader from './AppHeader'
import RouteTracker from 'components/Organizms/session/RouteTracker'
import AppRouteTracker from 'components/Organizms/session/AppRouteTracker'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
const AppLayout = ({ children }: { children: ReactNode }) => {
  const sessionSettings = useSessionSettings()
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>('dark')

  useEffect(() => {
    sessionSettings.savePalette(colorMode)
    setColorMode(sessionSettings.palette)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSettings.palette, colorMode])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newMode)
    sessionSettings.savePalette(newMode)
  }
  // const [elevationEffect, setElevationEffect] = useState(true)

  // const bodyScrolled = useScrollTrigger({
  //   disableHysteresis: true,
  //   threshold: 0,
  // })

  // useEffect(() => {
  //   setElevationEffect(bodyScrolled)
  // }, [bodyScrolled])

  return (
    <>
      <Analytics />
      <AppRouteTracker />
      <ThemeProvider theme={getTheme(colorMode)}>
        <CssBaseline />
        <AppHeader />
        <ResponsiveContainer>
          <Container sx={{ marginTop: 2, minHeight: 800, paddingBottom: 4 }}>{children}</Container>
        </ResponsiveContainer>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default AppLayout

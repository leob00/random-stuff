'use client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Header from 'components/Header'
import Layout from 'components/Layout'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import React, { ReactNode, useEffect } from 'react'
import awsconfig from '../src/aws-exports'
import { Amplify } from 'aws-amplify'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
Amplify.configure({ ...awsconfig, ssr: true })
const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
const AppLayout = ({ children }: { children: ReactNode }) => {
  const sessionSettings = useSessionSettings()
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>('dark')

  useEffect(() => {
    sessionSettings.savePalette(colorMode)
    setColorMode(sessionSettings.palette)
  }, [sessionSettings.palette, colorMode])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newMode)
    sessionSettings.savePalette(newMode)
  }
  return (
    <>
      {/* <Header onSetColorMode={handleChangeColorMode} colorTheme={colorMode} />

      <ThemeProvider theme={getTheme(colorMode)}>
        <CssBaseline />
        <Layout>{children}</Layout>
      </ThemeProvider> */}
    </>
  )
}

export default AppLayout

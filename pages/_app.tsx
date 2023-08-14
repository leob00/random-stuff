import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import Layout from 'components/Layout'
import awsconfig from '../src/aws-exports'
import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'
import Header from 'components/Header'
import { DarkMode } from 'components/themes/DarkMode'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
import React from 'react'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
Amplify.configure({ ...awsconfig, ssr: true })
//Amplify.configure(awsconfig)

function MyApp({ Component, pageProps }: AppProps) {
  const sessionSettings = useSessionSettings()
  const mode = useSessionSettings().palette
  const [colorMode, setColorModel] = React.useState<'dark' | 'light'>('light')

  useEffect(() => {
    sessionSettings.savePalette(colorMode)
  }, [colorMode])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorModel(newMode)
    //sessionSettings.savePalette(newMode)
  }
  const getTheme = (mode: 'light' | 'dark') => {
    return mode === 'dark' ? darkTheme : theme
  }

  return (
    <>
      <Header onSetColorMode={handleChangeColorMode} colorTheme={sessionSettings.palette} />

      <ThemeProvider theme={getTheme(colorMode)}>
        <CssBaseline />

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp

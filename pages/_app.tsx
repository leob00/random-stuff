import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline, Theme } from '@mui/material'
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
const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
function MyApp({ Component, pageProps }: AppProps) {
  const sessionSettings = useSessionSettings()
  const mode = useSessionSettings().palette
  //console.log(mode)
  const [colorMode, setColorModel] = React.useState<'dark' | 'light'>('light')
  //const [currentTheme, setCurrentTheme] = React.useState<Theme>(getTheme(mode))

  // useEffect(() => {
  //   sessionSettings.savePalette(colorMode)
  //   setColorModel(sessionSettings.palette)
  // }, [sessionSettings.palette])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorModel(newMode)
    //setCurrentTheme(getTheme(newMode))
    sessionSettings.savePalette(newMode)
  }

  return (
    <>
      <Header onSetColorMode={handleChangeColorMode} colorTheme={colorMode} />

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

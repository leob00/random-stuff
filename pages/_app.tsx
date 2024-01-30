import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import Layout from 'components/Layout'
import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'
import Header from 'components/Header'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
import React from 'react'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import awsconfig from '../src/aws-exports'

Amplify.configure({ ...awsconfig, ssr: true })
const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
function MyApp({ Component, pageProps }: AppProps) {
  const { palette, savePalette } = useSessionSettings()
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>('dark')

  useEffect(() => {
    if (palette !== colorMode) {
      savePalette(colorMode)
      setColorMode(palette)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette])

  const handleChangeColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newMode)
    savePalette(newMode)
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

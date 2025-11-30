import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import Layout from 'components/Layout'
import { useEffect, useState } from 'react'
import Header from 'components/Header'
import darkTheme from 'components/themes/darkTheme'
import theme from 'components/themes/mainTheme'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import Seo from 'components/Organizms/Seo'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import StyledRoot from 'components/themes/StyledRoot'

const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : theme
}
function MyApp({ Component, pageProps }: AppProps) {
  const { palette, savePalette } = useSessionSettings()

  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark')

  const theme = getTheme(colorMode)

  useEffect(() => {
    if (palette !== colorMode) {
      //savePalette(colorMode)
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
      <Seo pageTitle='Random Stuff' />
      <StyledRoot>
        <Component {...pageProps} />
      </StyledRoot>
    </>
  )
}

export default MyApp

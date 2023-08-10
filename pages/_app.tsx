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
Amplify.configure({ ...awsconfig, ssr: true })
//Amplify.configure(awsconfig)

function MyApp({ Component, pageProps }: AppProps) {
  //
  useEffect(() => {}, [])

  return (
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp

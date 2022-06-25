import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { Container, CssBaseline } from '@mui/material'
import theme from 'components/emmaTheme'
import Layout from 'components/Layout'

//Amplify.configure(awsconfig)
function MyApp({ Component, pageProps }: AppProps) {
  //
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default MyApp

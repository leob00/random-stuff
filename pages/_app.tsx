import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import theme from 'components/themes/mainTheme'
import Layout from 'components/Layout'
import awsconfig from '../src/aws-exports'
import { Amplify } from 'aws-amplify'
import { useEffect } from 'react'
Amplify.configure({ ...awsconfig, ssr: true })
//Amplify.configure(awsconfig)

function MyApp({ Component, pageProps }: AppProps) {
  //
  useEffect(() => {
    //router.prefetch('/protected')
    //router.push('/csr/waitandredirect/home')
  }, [])

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

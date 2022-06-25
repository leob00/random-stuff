import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Paper } from '@mui/material'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './emmaTheme'
import { Amplify, Auth } from 'aws-amplify'
import awsconfig from 'aws-exports'
import { CognitoUser } from '@aws-amplify/auth'
import { CognitoUserSession } from 'amazon-cognito-identity-js'

Amplify.configure(awsconfig)
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ marginTop: 2, minHeight: '730px' }}>{children}</Container> <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

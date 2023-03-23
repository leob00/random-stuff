import React, { ReactNode } from 'react'
import { ThemeProvider } from '@mui/styles'
import { Container, CssBaseline } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './themes/mainTheme'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ marginTop: 2, minHeight: 600, paddingBottom: 4 }}>{children}</Container>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

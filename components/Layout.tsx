import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider } from '@mui/styles'
import { Container, CssBaseline, Paper } from '@mui/material'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './themes/mainTheme'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ marginTop: 2, minHeight: 660 }}>{children}</Container> <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

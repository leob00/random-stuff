import React, { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline, Paper } from '@mui/material'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './emmaTheme'

const Layout = ({ children, home }: { children: ReactNode; home?: boolean }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header home={home} />
        <Container sx={{ marginTop: 2, minHeight: '730px' }}>{children}</Container> <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

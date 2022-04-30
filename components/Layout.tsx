import React, { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Container, CssBaseline } from '@mui/material'
import { Box } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './emmaTheme'

const Layout = ({ children, home }: { children: ReactNode; home?: boolean }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container>
          <Header home={home} />
          <Box sx={{ marginTop: 14, minHeight: '540px' }}>{children}</Box>
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

import React, { ReactNode } from 'react'
import { ThemeProvider } from '@mui/styles'
import { Container, CssBaseline } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import theme from './themes/mainTheme'
import RouteTracker from 'components/Organizms/session/RouteTracker'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <RouteTracker>
          <Container sx={{ marginTop: 2, minHeight: 600, paddingBottom: 4 }}>{children}</Container>
        </RouteTracker>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default Layout

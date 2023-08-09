import React, { ReactNode } from 'react'
import { Box, Container, ThemeProvider } from '@mui/material'
import Footer from './Footer'
import RouteTracker from 'components/Organizms/session/RouteTracker'
import darkTheme from './themes/darkTheme'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box>
      <RouteTracker>
        <Container sx={{ marginTop: 2, minHeight: 600, paddingBottom: 4 }}>{children}</Container>
      </RouteTracker>
      <Footer />
    </Box>
  )
}

export default Layout

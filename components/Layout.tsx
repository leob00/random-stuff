import React, { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Footer from './Footer'
import RouteTracker from 'components/Organizms/session/RouteTracker'
import { Analytics } from '@vercel/analytics/react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Analytics />
      <Box>
        <RouteTracker>
          <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4 }}>{children}</Container>
        </RouteTracker>
        <Footer />
      </Box>
    </>
  )
}

export default Layout

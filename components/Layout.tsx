import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Footer from './Footer'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <Analytics /> */}
      <Box>
        <Container sx={{ marginTop: 2, minHeight: 760, paddingBottom: 4 }}>{children}</Container>
        <Footer />
      </Box>
    </>
  )
}

export default Layout

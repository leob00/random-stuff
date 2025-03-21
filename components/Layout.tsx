import { ReactNode } from 'react'
import { Box, Container } from '@mui/material'
import Footer from './Footer'
import RouteTracker from './Organizms/session/RouteTracker'
import amplifyConfig from 'src/amplifyconfiguration.json'
import { Amplify } from 'aws-amplify'
Amplify.configure(amplifyConfig, { ssr: true })
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <Analytics /> */}
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

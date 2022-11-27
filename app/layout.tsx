'use client'
import { CssBaseline, Container } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import theme from 'components/themes/mainTheme'
import { ThemeProvider } from 'styled-components'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ marginTop: 2, minHeight: 500, paddingBottom: 4 }}>{children}</Container>
        <Footer />
      </ThemeProvider>
    </>
  )
}

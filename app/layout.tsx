import { CssBaseline, Container } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Layout from 'components/Layout'
import RouteTracker from 'components/Organizms/session/RouteTracker'
import theme from 'components/themes/mainTheme'
import { ThemeProvider } from 'styled-components'
import AppLayout from './AppLayout'
import ThemeRegistry from './theme/ThemeRegistry'

export const metadata = {
  title: 'Random Stuff',
  description: 'Random Stuff - app router',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <ThemeRegistry>
        <body>{children}</body>
      </ThemeRegistry>
    </html>
  )
}

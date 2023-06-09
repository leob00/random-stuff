import { CssBaseline, Container } from '@mui/material'
import Footer from 'components/Footer'
import Header from 'components/Header'
import RouteTracker from 'components/Organizms/session/RouteTracker'
import theme from 'components/themes/mainTheme'
import { ThemeProvider } from 'styled-components'

export const metadata = {
  title: 'Random Stuff',
  description: 'Random Stuff - app router',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang='en'>{children}</html>
}

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
        <body>
          <AppLayout>{children}</AppLayout>
        </body>
      </ThemeRegistry>
    </html>
  )
}

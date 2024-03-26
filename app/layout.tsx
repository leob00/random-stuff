import { Amplify } from 'aws-amplify'
import AppLayout from 'components/app/AppLayout'
import ThemeRegistry from './theme/ThemeRegistry'
import awsconfig from '../src/aws-exports'
Amplify.configure({ ...awsconfig, ssr: true })

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

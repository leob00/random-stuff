import { Amplify } from 'aws-amplify'
import AppLayout from 'components/app/AppLayout'
import ThemeRegistry from './theme/ThemeRegistry'
import awsconfig from '../src/aws-exports'
import { Metadata } from 'next'
Amplify.configure({ ...awsconfig, ssr: true })

export const metadata: Metadata = {
  title: 'Random Stuff',
  description: 'Recipes, news, stocks, and more',
  openGraph: {
    images: ['https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png'],
  },
  twitter: {
    title: 'Random Stuff',
    description: 'Recipes, news, stocks, and more',
    images: ['https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png'],
  },
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

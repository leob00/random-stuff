import { Metadata } from 'next'
import { Amplify } from 'aws-amplify'
import ThemeWrapper from './theme/ThemeWrapper'
import { Suspense } from 'react'

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
      <Suspense>
        <ThemeWrapper>{children}</ThemeWrapper>
      </Suspense>
    </html>
  )
}

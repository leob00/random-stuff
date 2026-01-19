import { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import StyledRoot from 'components/themes/StyledRoot'

export const metadata: Metadata = {
  title: 'Random Stuff',
  description: 'Recipes, news, stocks, and more',
  openGraph: {
    images: [
      {
        url: 'https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png',
        height: 600,
        width: 800,
      },
    ],
    description: 'Recipes, news, stocks, and more',
  },
  twitter: {
    title: 'Random Stuff',
    description: 'Recipes, news, stocks, and more',
    images: [
      {
        url: 'https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png',
        height: 600,
        width: 800,
      },
    ],
    card: 'summary_large_image',
    site: 'https://random-stuff-seven.vercel.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider>
          <StyledRoot>{children}</StyledRoot>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

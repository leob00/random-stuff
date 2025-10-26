import { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import StyledRoot from 'components/themes/StyledRoot'

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
      <body>
        <AppRouterCacheProvider>
          <StyledRoot>{children}</StyledRoot>
        </AppRouterCacheProvider>
        {/* <Suspense>
          <ThemeWrapper>{children}</ThemeWrapper>
        </Suspense> */}
      </body>
    </html>
  )
}

import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import HomePage from './HomePage'
import { Metadata } from 'next'

//export const dynamic = 'force-dynamic' // disable cache

export const metadata: Metadata = {
  title: 'Random Stuff - Home',
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
    title: 'Random Stuff - Home',
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

export default async function Page() {
  return (
    <>
      <Seo pageTitle='Home' />
      <PageHeader text='Home' />

      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <HomePage />
        </Suspense>
      </Box>
    </>
  )
}

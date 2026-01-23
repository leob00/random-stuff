import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import HomePage from './HomePage'
import { Metadata } from 'next'
import { ogImagePath } from 'lib/backend/seo/seoSettings'

//export const dynamic = 'force-dynamic' // disable cache

export const metadata: Metadata = {
  title: 'Random Stuff - Home',
  description: 'Recipes, news, stocks, and more',
  openGraph: {
    images: [
      {
        url: ogImagePath,
        //height: 600,
        // width: 800,
      },
    ],
    description: 'Recipes, news, stocks, and more',
  },
  twitter: {
    title: 'Random Stuff - Home',
    description: 'Recipes, news, stocks, and more',
    images: [
      {
        url: ogImagePath,
        //height: 600,
        //width: 800,
      },
    ],
    card: 'summary_large_image',
    site: 'https://random-stuff-seven.vercel.app',
  },
}

export default async function Page() {
  return (
    <>
      <PageHeader text='Home' />
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <HomePage />
        </Suspense>
      </Box>
    </>
  )
}

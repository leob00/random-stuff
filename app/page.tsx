import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import HomePage from './HomePage'

//export const dynamic = 'force-dynamic' // disable cache
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

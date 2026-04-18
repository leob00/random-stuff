import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import NewsPage from './ChatPage'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Chat with AI' />
      <PageHeader text='Chat with AI' />

      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <NewsPage />
        </Suspense>
      </Box>
    </>
  )
}

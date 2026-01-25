import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SecretsPage from './SecretsPage'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='Secrets' />
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <SecretsPage />
        </Suspense>
      </Box>
    </>
  )
}

import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import SecretsPage from './SecretsPage'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='Secrets' />
      <Box>
        <Suspense fallback={<BackdropLoader />}>
          <SecretsPage />
        </Suspense>
      </Box>
    </>
  )
}

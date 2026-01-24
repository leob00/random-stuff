import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import UserProfileView from './UserProfileView'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <PageHeader text='Profile' />
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <UserProfileView />
        </Suspense>
      </Box>
    </>
  )
}

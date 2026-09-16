import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import UserDashboardLayout from 'components/Organizms/dashboard/UserDashboardLayout'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Dashboard' />
      <PageHeader text='Dashboard' />
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <UserDashboardLayout />
        </Suspense>
      </Box>
    </>
  )
}

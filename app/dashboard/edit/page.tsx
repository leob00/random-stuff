import { Suspense } from 'react'
import { Box } from '@mui/material'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import UserDashboardLayout from 'components/Organizms/dashboard/UserDashboardLayout'
import EditDashboard from 'components/Organizms/dashboard/EditDashboard'
import router from 'next/navigation'
import EditDashboardPage from './EditDashboardPage'

//export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <>
      <Seo pageTitle='Edit Dashboard' />
      <PageHeader text={'Edit Dashboard'} backButtonRoute={'/dashboard'} forceShowBackButton />
      <Box>
        <Suspense fallback={<ComponentLoader />}>
          <EditDashboardPage />
        </Suspense>
      </Box>
    </>
  )
}

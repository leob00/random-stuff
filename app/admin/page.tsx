import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { Suspense } from 'react'
import AdminPage from './AdminPage'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Admin'} />
      <Suspense fallback={<ComponentLoader />}>
        <AdminPage />
      </Suspense>
    </>
  )
}

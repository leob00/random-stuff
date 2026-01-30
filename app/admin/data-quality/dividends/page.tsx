import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { Suspense } from 'react'
import AdminManageDividendsPage from './AdminManageDividendsPage'
import BackButton from 'components/Atoms/Buttons/BackButton'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Data Quality - Dividends'} />
      <BackButton route='/admin/data-quality' text='Data Quality' />

      <Suspense fallback={<ComponentLoader />}>
        <AdminManageDividendsPage />
      </Suspense>
    </>
  )
}

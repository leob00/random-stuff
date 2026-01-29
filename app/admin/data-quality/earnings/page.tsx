import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import AdminEarningsWrapper from 'components/Organizms/admin/data-quality/earnings/AdminEarningsWrapper'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Data Quality - Earnings'} />
      <Suspense fallback={<ComponentLoader />}>
        <AdminEarningsWrapper />
      </Suspense>
    </>
  )
}

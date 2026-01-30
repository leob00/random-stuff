import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { Suspense } from 'react'
import DataQualityPage from './DataQualityPage'
import BackButton from 'components/Atoms/Buttons/BackButton'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Data Quality - Earnings'} />
      <BackButton route='/admin' text='Administration' />
      <Suspense fallback={<ComponentLoader />}>
        <DataQualityPage />
      </Suspense>
    </>
  )
}

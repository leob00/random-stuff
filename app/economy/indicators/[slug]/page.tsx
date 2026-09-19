import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconomicIndicatorsPage from 'pages/csr/economic-indicators'
import { Suspense } from 'react'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <PageHeader text='Economic Indicator' />
      <Suspense fallback={<ComponentLoader />}>
        <EconomicIndicatorsPage />
      </Suspense>
    </>
  )
}

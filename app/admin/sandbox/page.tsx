import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { Suspense } from 'react'
import SandboxPage from './SandboxPage'

export default async function Page() {
  return (
    <>
      <PageHeader text={'Admin Sandbox'} />
      <Suspense fallback={<ComponentLoader />}>
        <SandboxPage />
      </Suspense>
    </>
  )
}

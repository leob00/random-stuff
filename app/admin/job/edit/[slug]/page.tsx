import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { Suspense } from 'react'
import JobEditPage from './JobEditPage'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <Suspense fallback={<ComponentLoader />}>
        <JobEditPage id={slug} />
      </Suspense>
    </>
  )
}

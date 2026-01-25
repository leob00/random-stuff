import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import { Suspense } from 'react'
import UserGoalsPage from './UserGoalsPage'

export default async function Page() {
  return (
    <>
      <PageHeader text='Goals' />
      <Suspense fallback={<ComponentLoader />}>
        <RequireUserProfile>
          <UserGoalsPage />
        </RequireUserProfile>
      </Suspense>
    </>
  )
}

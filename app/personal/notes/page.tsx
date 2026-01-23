import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <>
      <PageHeader text='Notes' />
      <Suspense fallback={<ComponentLoader />}>
        <RequireUserProfile>
          <UserNotesLayout />
        </RequireUserProfile>
      </Suspense>
    </>
  )
}

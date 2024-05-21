import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Dashboard' />
      <ResponsiveContainer>
        <PageHeader text={'Dashboard'} />
        <RequireUserProfile>
          <UserDashboardLayout />
        </RequireUserProfile>
      </ResponsiveContainer>
    </>
  )
}

export default Page

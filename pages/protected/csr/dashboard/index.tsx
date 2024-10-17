import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import UserDashboardLayout from 'components/Organizms/dashboard/UserDashboardLayout'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Dashboard' />
      <ResponsiveContainer>
        <PageHeader text={'Dashboard'} />
        <UserDashboardLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

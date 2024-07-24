import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'

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

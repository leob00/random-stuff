import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import EditDashboard from 'components/Organizms/dashboard/EditDashboard'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Edit Dashboard' />
      <ResponsiveContainer>
        <PageHeader text={'Edit Dashboard'} backButtonRoute={'/protected/csr/dashboard'} forceShowBackButton />
        <EditDashboard />
      </ResponsiveContainer>
    </>
  )
}

export default Page

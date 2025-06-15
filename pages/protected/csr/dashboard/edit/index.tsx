import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import EditDashboard from 'components/Organizms/dashboard/EditDashboard'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  return (
    <>
      <Seo pageTitle='Edit Dashboard' />
      <ResponsiveContainer>
        <PageHeader text={'Edit Dashboard'} backButtonRoute={'/protected/csr/dashboard'} forceShowBackButton />
        <EditDashboard
          onClose={() => {
            router.push('/protected/csr/dashboard')
          }}
        />
      </ResponsiveContainer>
    </>
  )
}

export default Page

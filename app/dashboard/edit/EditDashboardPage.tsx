'use client'

import EditDashboard from 'components/Organizms/dashboard/EditDashboard'
import { useRouter } from 'next/navigation'

const EditDashboardPage = () => {
  const router = useRouter()
  return (
    <EditDashboard
      onClose={() => {
        router.push('/dashboard')
      }}
    />
  )
}

export default EditDashboardPage

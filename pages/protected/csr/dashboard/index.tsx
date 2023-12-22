import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserDashboardLayout from 'components/Organizms/user/UserDashboardLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import Seo from 'components/Organizms/Seo'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const Page = () => {
  const { ticket, authProfile, setProfile, fetchProfilePassive } = useUserController()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive(300)
        setProfile(p)
      }
      setLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  return (
    <>
      <Seo pageTitle='Dashboard' />
      <ResponsiveContainer>
        <PageHeader text={'Dashboard'} />
        <Box>{loading ? <BackdropLoader /> : authProfile ? <UserDashboardLayout ticket={ticket} /> : <PleaseLogin />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
